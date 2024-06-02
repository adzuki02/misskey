
process.env.NODE_ENV = 'test';

import * as assert from 'assert';
import { sleep, api, post, signup, simpleGet, relativeFetch, failedApiCall, successfulApiCall, randomString, sendEnvUpdateRequest } from '../utils.js';
import type * as misskey from 'misskey-js';

function genHost() {
	return randomString() + '.example.com';
}

describe('独自拡張', () => {
	let alice: misskey.entities.SignupResponse;
	let bob: misskey.entities.SignupResponse;
	let remoteUser: misskey.entities.SignupResponse;
	let proxy: misskey.entities.SignupResponse;

	beforeAll(async () => {
		alice = await signup({ username: 'alice' });
		bob = await signup({ username: 'bob' });
		remoteUser = await signup({ username: 'remoteUser', host: genHost() });
		proxy = await signup({ username: 'proxy' });
		await api('/admin/update-meta', { proxyAccountId: proxy.id }, alice);
	}, 1000 * 60 * 2);

	describe('連合に関する情報を隠す', () => {
		describe('/api/v1/instance/peers', () => {
			test('は存在しない', async () => {
				const res = await simpleGet('/api/v1/instance/peers', 'application/json');
				assert.strictEqual(res.status, 404);
			});
		});

		describe.each([
			{ endpoint: '/federation/instances' },
			{ endpoint: '/federation/show-instance', param: { host: 'misskey.local' }, couldBeEmpty: true },
			{ endpoint: '/federation/stats' },
			{ endpoint: '/charts/instance', param: { host: 'misskey.local', span: 'day' } },
		])('/api$endpoint', ({ endpoint, param, couldBeEmpty }) => {
			test('はGETできない。', async () => {
				const res = await simpleGet(`/api${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api(endpoint, {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint, param ?? {}, bob);
				assert.strictEqual(res.status, couldBeEmpty ? 204 : 200);
			});
		});
	});

	describe('オンラインユーザー数を隠す', () => {
		describe('/api/get-online-users-count', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/get-online-users-count', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api('/get-online-users-count', {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('/get-online-users-count', {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('各ユーザーのチャートを見られるのを本人とモデレーターのみに', () => {
		describe.each([
			{ endpoint: '/charts/user/pv' },
			{ endpoint: '/charts/user/drive' },
			{ endpoint: '/charts/user/following' },
			{ endpoint: '/charts/user/notes' },
			{ endpoint: '/charts/user/reactions' },
		])('/api$endpoint', ({ endpoint }) => {
			test('はGETできない。', async() => {
				const res = await simpleGet(`/api${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api('/charts/user/pv', {});
				assert.strictEqual(res.status, 401);
			});

			test('はモデレータならアクセスできる。', async () => {
				const res = await api('/charts/user/pv', { span: 'day', userId: bob.id }, alice);
				assert.strictEqual(res.status, 200);
			});

			test('は本人ならアクセスできる。', async () => {
				const res = await api('/charts/user/pv', { span: 'day', userId: bob.id }, bob);
				assert.strictEqual(res.status, 200);
			});

			test('はモデレータでも本人でもないならアクセスできない。', async () => {
				const res = await api('/charts/user/pv', { span: 'day', userId: alice.id }, bob);
				assert.strictEqual(res.status, 400);
			});
		});
	});

	describe('サーバーのチャートを隠す', () => {
		describe.each([
			{ endpoint: '/charts/active-users', param: { span: 'day' } },
			{ endpoint: '/charts/drive', param: { span: 'day' } },
			{ endpoint: '/charts/notes', param: { span: 'day' } },
			{ endpoint: '/retention' },
		])('/api$endpoint', ({ endpoint, param }) => {
			test('はGETできない。', async () => {
				const res = await simpleGet(`/api${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api(endpoint, param ?? {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint, param ?? {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('リモートユーザーのFFの表示をクレデンシャル必須に', () => {
		describe.each([
			{ endpoint: '/users/followers' },
			{ endpoint: '/users/following' },
		])('/api$endpoint', ({ endpoint }) => {
			test('は認証が必要。', async () => {
				const res = await api(endpoint, { userId: remoteUser.id });
				assert.strictEqual(res.status, 400);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint, { userId: remoteUser.id }, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('ノート数を隠す', () => {
		beforeAll(async () => {
			await api('/notes/create', { text: 'note' }, alice);
			await api('/notes/create', { text: 'note' }, bob);
		});

		describe('/api/stats', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/stats', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証がない場合レスポンスのノート数は0になる。', async () => {
				const res = await api('/stats', {});
				assert.strictEqual(res.body.notesCount, 0);
				assert.strictEqual(res.body.originalNotesCount, 0);
			});

			// チャートが即時にアップデートされないので保留
			// test('はトークンがあればレスポンスに正確なノート数を含む。', async () => {
			// 	const res = await api('/stats', {}, bob);
			// 	assert.notStrictEqual(res.body.notesCount, 0);
			// 	assert.notStrictEqual(res.body.originalNotesCount, 0);
			// });
		});

		describe.each([
			{ path: '/nodeinfo/2.1' },
			{ path: '/nodeinfo/2.0' },
		])('$path', ({ path }) => {
			test('のlocalPostsは0である。', async () => {
				const res = await relativeFetch(path, {
					headers: {
						Accept: 'application/json',
					},
				});
				assert.strictEqual((await res.json() as any).usage.localPosts, 0);
			});
		});

		describe('/api/users/show', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/users/show', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証がない場合updatedAtがnullになる。', async () => {
				const res = await api('/users/show', { userId: alice.id });
				assert.strictEqual(res.body.updatedAt, null);
			});

			test('は認証がない場合notesCountが0になる。', async () => {
				const res = await api('/users/show', { userId: alice.id });
				assert.strictEqual(res.body.notesCount, 0);
			});

			test('はトークンがあればupdatedAtがnullにならない。', async () => {
				const res = await api('/users/show', { userId: alice.id }, bob);
				assert.notStrictEqual(res.body.updatedAt, null);
			});

			test('はトークンがあればnotesCountが0にならない。', async () => {
				const res = await api('/users/show', { userId: alice.id }, bob);
				assert.notStrictEqual(res.body.notesCount, 0);
			});
		});
	});

	describe('ハイライトを隠す', () => {
		describe('/api/notes/featured', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/notes/featured', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api('/notes/featured', {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('/notes/featured', {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});

		describe('/api/users', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/users', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('はoriginがlocalの場合認証がなくてもよい。', async () => {
				const res = await api('/users', { origin: 'local' });
				assert.strictEqual(res.status, 200);
			});

			test('はoriginがremoteの場合認証が必要。', async () => {
				const res = await api('/users', { origin: 'remote' });
				assert.strictEqual(res.status, 400);
			});

			test('はoriginがcombinedの場合認証が必要。', async () => {
				const res = await api('/users', { origin: 'combined' });
				assert.strictEqual(res.status, 400);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('/users', { origin: 'remote' }, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('プロキシアカウントの動作を変更', () => {
		beforeAll(async () => {
			await sendEnvUpdateRequest({ key: 'FORCE_FOLLOW_REMOTE_USER_FOR_TESTING', value: 'true' });
		});

		beforeEach(async () => {
			await api('/following/delete', { userId: remoteUser.id }, alice);
			await api('/following/delete', { userId: remoteUser.id }, proxy);
		});

		test('ローカルにフォロワーのいるリモートユーザーをフォローしてもプロキシアカウントからフォローリクエストが飛ばない。', async () => {
			await api('/following/create', { userId: remoteUser.id }, alice);
			const listCreateRes = await api('/users/lists/create', { name: 'list' }, alice);
			await api('/users/lists/push', { listId: listCreateRes.body.id, userId: remoteUser.id }, alice);
			const followers = await api('/users/followers', { userId: remoteUser.id }, alice);
			assert.strictEqual(followers.body.length, 1);
			assert.strictEqual(followers.body[0].follower.id, alice.id);
		});

		// 動作しない
		// test('ローカルにフォロワーのいないリモートユーザーをフォローするとプロキシアカウントからフォローリクエストが飛ぶ', async () => {
		// 	const listCreateRes = await api('/users/lists/create', { name: 'list' }, alice);
		// 	await api('/users/lists/push', { listId: listCreateRes.body.id, userId: remoteUser.id }, alice);
		// 	const followers = await api('/users/followers', { userId: remoteUser.id }, alice);
		// 	assert.strictEqual(followers.body.length, 1);
		// 	assert.strictEqual(followers.body[0].follower.id, proxy.id);
		// });
	});

	describe('通知を除外するミュートの実装', () => {
		beforeEach(async () => {
			await api('/mute/delete', { userId: bob.id }, alice);
			await api('/notes/create', { text: 'text' }, bob);
		});

		afterEach(async () => {
			await api('/mute/delete', { userId: bob.id }, alice);
		});

		describe('通常のミュート', () => {
			beforeAll(async () => {
				await api('/mute/create', { userId: bob.id, expiresAt: null, excludeNotification: false }, alice);
				await api('/notes/create', { text: '@alice text' }, bob);
			});

			test('がTLにミュート対象のユーザーのノートを含まない。', async () => {
				const hTl = await api('/notes/timeline', {}, alice);
				for (const note of hTl.body) {
					assert.notStrictEqual(note.userId, bob.id);
				}
			});

			// 動作しない
			// test('が通知欄にミュート対象のユーザーからの通知を含まない。', async () => {
			// 	const notificationTl = await api('/i/notifications', {}, alice);
			// 	for (const notification of notificationTl.body) {
			// 		assert.notStrictEqual(notification.userId, bob.id);
			// 	}
			// });
		});

		describe('通知を除外ずるミュート', () => {
			beforeAll(async () => {
				await api('/mute/create', { userId: bob.id, expiresAt: null, excludeNotification: true }, alice);
				await api('/notes/create', { text: '@alice text' }, bob);
			});

			test('がTLにミュート対象のユーザーのノートを含まない。', async () => {
				const hTl = await api('/notes/timeline', {}, alice);
				for (const note of hTl.body) {
					assert.notStrictEqual(note.userId, bob.id);
				}
			});

			test('が通知欄にミュート対象のユーザーからの通知を含む。', async () => {
				const notificationTl = await api('/i/notifications', {}, alice);
				const countOfNotificationFromMutee = notificationTl.body.filter((notification: any) => notification.userId === bob.id).length;
				assert.notStrictEqual(countOfNotificationFromMutee, 0);
			});
		});
	});
});
