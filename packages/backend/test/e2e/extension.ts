
process.env.NODE_ENV = 'test';

import * as assert from 'assert';
import { api, signup, simpleGet, relativeFetch, randomString, sendEnvUpdateRequest } from '../utils.js';
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
		await api('admin/update-meta', { proxyAccountId: proxy.id }, alice);
	}, 1000 * 60 * 2);

	describe('連合に関する情報を隠す', () => {
		describe('/api/v1/instance/peers', () => {
			test('は存在しない', async () => {
				const res = await simpleGet('/api/v1/instance/peers', 'application/json');
				assert.strictEqual(res.status, 404);
			});
		});

		describe.each([
			{ endpoint: 'federation/instances' },
			{ endpoint: 'federation/show-instance', param: { host: 'misskey.local' }, couldBeEmpty: true },
			{ endpoint: 'federation/stats' },
			{ endpoint: 'charts/instance', param: { host: 'misskey.local', span: 'day' } },
		])('/api/$endpoint', ({ endpoint, param, couldBeEmpty }) => {
			test('はGETできない。', async () => {
				const res = await simpleGet(`/api/${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, param ?? {}, bob);
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
				const res = await api('get-online-users-count', {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('get-online-users-count', {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('各ユーザーのチャートを見られるのを本人とモデレーターのみに', () => {
		describe.each([
			{ endpoint: 'charts/user/pv' },
			{ endpoint: 'charts/user/drive' },
			{ endpoint: 'charts/user/following' },
			{ endpoint: 'charts/user/notes' },
			{ endpoint: 'charts/user/reactions' },
		])('/api/$endpoint', ({ endpoint }) => {
			test('はGETできない。', async() => {
				const res = await simpleGet(`/api/${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, {});
				assert.strictEqual(res.status, 401);
			});

			test('はモデレータならアクセスできる。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, { span: 'day', userId: bob.id }, alice);
				assert.strictEqual(res.status, 200);
			});

			test('は本人ならアクセスできる。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, { span: 'day', userId: bob.id }, bob);
				assert.strictEqual(res.status, 200);
			});

			test('はモデレータでも本人でもないならアクセスできない。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, { span: 'day', userId: alice.id }, bob);
				assert.strictEqual(res.status, 400);
			});
		});
	});

	describe('サーバーのチャートを隠す', () => {
		describe.each([
			{ endpoint: 'charts/active-users', param: { span: 'day' } },
			{ endpoint: 'charts/drive', param: { span: 'day' } },
			{ endpoint: 'charts/notes', param: { span: 'day' } },
			{ endpoint: 'retention' },
		])('/api/$endpoint', ({ endpoint, param }) => {
			test('はGETできない。', async () => {
				const res = await simpleGet(`/api/${endpoint}`, 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証が必要。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, param ?? {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, param ?? {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('リモートユーザーのFFの表示をクレデンシャル必須に', () => {
		describe.each([
			{ endpoint: 'users/followers' },
			{ endpoint: 'users/following' },
		])('/api/$endpoint', ({ endpoint }) => {
			test('は認証が必要。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, { userId: remoteUser.id });
				assert.strictEqual(res.status, 400);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api(endpoint as keyof misskey.Endpoints, { userId: remoteUser.id }, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('ノート数を隠す', () => {
		beforeAll(async () => {
			await api('notes/create', { text: 'note' }, alice);
			await api('notes/create', { text: 'note' }, bob);
		});

		describe('/api/stats', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/stats', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('は認証がない場合レスポンスのノート数は0になる。', async () => {
				const res = await api('stats', {});
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
				const res = await api('users/show', { userId: alice.id });
				assert.strictEqual(res.body.updatedAt, null);
			});

			test('は認証がない場合notesCountが0になる。', async () => {
				const res = await api('users/show', { userId: alice.id });
				assert.strictEqual(res.body.notesCount, 0);
			});

			test('はトークンがあればupdatedAtがnullにならない。', async () => {
				const res = await api('users/show', { userId: alice.id }, bob);
				assert.notStrictEqual(res.body.updatedAt, null);
			});

			test('はトークンがあればnotesCountが0にならない。', async () => {
				const res = await api('users/show', { userId: alice.id }, bob);
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
				const res = await api('notes/featured', {});
				assert.strictEqual(res.status, 401);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('notes/featured', {}, bob);
				assert.strictEqual(res.status, 200);
			});
		});

		describe('/api/users', () => {
			test('はGETできない。', async () => {
				const res = await simpleGet('/api/users', 'application/json');
				assert.strictEqual(res.status, 405);
			});

			test('はoriginがlocalの場合認証がなくてもよい。', async () => {
				const res = await api('users', { origin: 'local' });
				assert.strictEqual(res.status, 200);
			});

			test('はoriginがremoteの場合認証が必要。', async () => {
				const res = await api('users', { origin: 'remote' });
				assert.strictEqual(res.status, 400);
			});

			test('はoriginがcombinedの場合認証が必要。', async () => {
				const res = await api('users', { origin: 'combined' });
				assert.strictEqual(res.status, 400);
			});

			test('はトークンがあればアクセスできる。', async () => {
				const res = await api('users', { origin: 'remote' }, bob);
				assert.strictEqual(res.status, 200);
			});
		});
	});

	describe('プロキシアカウントの動作を変更', () => {
		beforeAll(async () => {
			await sendEnvUpdateRequest({ key: 'FORCE_FOLLOW_REMOTE_USER_FOR_TESTING', value: 'true' });
		});

		beforeEach(async () => {
			await api('following/delete', { userId: remoteUser.id }, alice);
			await api('following/delete', { userId: remoteUser.id }, proxy);
		});

		test('ローカルにフォロワーのいるリモートユーザーをフォローしてもプロキシアカウントからフォローリクエストが飛ばない。', async () => {
			await api('following/create', { userId: remoteUser.id }, alice);
			const listCreateRes = await api('users/lists/create', { name: 'list' }, alice);
			await api('users/lists/push', { listId: listCreateRes.body.id, userId: remoteUser.id }, alice);
			const followers = await api('users/followers', { userId: remoteUser.id }, alice);
			assert.strictEqual(followers.body.length, 1);
			assert.notStrictEqual(followers.body[0].follower, undefined);
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			assert.strictEqual(followers.body[0].follower!.id, alice.id);
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
		describe('通常のミュート', () => {
			test('ミュート作成', async () => {
				const res = await api('mute/create', { userId: bob.id, expiresAt: null, excludeNotification: false }, alice);
				assert.strictEqual(res.status, 204);
			});

			test('がTLにミュート対象のユーザーのノートを含まない。', async () => {
				await api('notes/create', { text: 'text' }, bob);
				const res = await api('notes/timeline', {}, alice);
				for (const note of res.body) {
					assert.notStrictEqual(note.userId, bob.id);
				}
			});

			test('が通知欄にミュート対象のユーザーからの通知を含まない。', async () => {
				await api('notes/create', { text: '@alice text' }, bob);
				await new Promise<void>(res => {
					setTimeout(() => {
						res();
					}, 2000);
				});
				const res = await api('i/notifications', {}, alice);
				for (const n of res.body) {
					if (n.type === 'mention') {
						assert.notStrictEqual(n.userId, bob.id);
					}
				}
			});

			test('ミュート解除', async () => {
				const res = await api('mute/delete', { userId: bob.id }, alice);
				assert.strictEqual(res.status, 204);
			});
		});

		describe('通知を除外ずるミュート', () => {
			test('ミュート作成', async () => {
				const res = await api('mute/create', { userId: bob.id, expiresAt: null, excludeNotification: true }, alice);
				assert.strictEqual(res.status, 204);
			});

			test('がTLにミュート対象のユーザーのノートを含まない。', async () => {
				await api('notes/create', { text: 'text' }, bob);
				const res = await api('notes/timeline', {}, alice);
				for (const note of res.body) {
					assert.notStrictEqual(note.userId, bob.id);
				}
			});

			test('が通知欄にミュート対象のユーザーからの通知を含む。', async () => {
				await api('notes/create', { text: '@alice text' }, bob);
				await new Promise<void>(res => {
					setTimeout(() => {
						res();
					}, 2000);
				});
				const res = await api('i/notifications', {}, alice);
				const count = res.body.filter((notification: any) => notification.userId === bob.id).length;
				assert.notStrictEqual(count, 0);
			});

			test('ミュート解除', async () => {
				const res = await api('mute/delete', { userId: bob.id }, alice);
				assert.strictEqual(res.status, 204);
			});
		});
	});
});
