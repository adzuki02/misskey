/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { createApp, defineAsyncComponent, markRaw } from 'vue';
import { common } from './common.js';
import type * as Misskey from 'misskey-js';
import { ui } from '@/config.js';
import { i18n } from '@/i18n.js';
import { alert, confirm, popup, post, toast } from '@/os.js';
import { useStream } from '@/stream.js';
import * as sound from '@/scripts/sound.js';
import { $i, signout, updateAccount } from '@/account.js';
import { instance } from '@/instance.js';
import { ColdDeviceStorage, defaultStore } from '@/store.js';
import { reactionPicker } from '@/scripts/reaction-picker.js';
import { miLocalStorage } from '@/local-storage.js';
import { initializeSw } from '@/scripts/initialize-sw.js';
import { deckStore } from '@/ui/deck/deck-store.js';
import { emojiPicker } from '@/scripts/emoji-picker.js';
import { mainRouter } from '@/router/main.js';
import { type Keymap, makeHotkey } from '@/scripts/hotkey.js';

export async function mainBoot() {
	const { isClientUpdated } = await common(() => createApp(
		new URLSearchParams(window.location.search).has('zen') || (ui === 'deck' && deckStore.state.useSimpleUiForNonRootPages && location.pathname !== '/') ? defineAsyncComponent(() => import('@/ui/zen.vue')) :
		!$i ? defineAsyncComponent(() => import('@/ui/visitor.vue')) :
		ui === 'deck' ? defineAsyncComponent(() => import('@/ui/deck.vue')) :
		defineAsyncComponent(() => import('@/ui/universal.vue')),
	));

	reactionPicker.init();
	emojiPicker.init();

	if (isClientUpdated && $i) {
		const { dispose } = popup(defineAsyncComponent(() => import('@/components/MkUpdated.vue')), {}, {
			closed: () => dispose(),
		});
	}

	const stream = useStream();

	let reloadDialogShowing = false;
	stream.on('_disconnected_', async () => {
		if (defaultStore.state.serverDisconnectedBehavior === 'reload') {
			location.reload();
		} else if (defaultStore.state.serverDisconnectedBehavior === 'dialog') {
			if (reloadDialogShowing) return;
			reloadDialogShowing = true;
			const { canceled } = await confirm({
				type: 'warning',
				title: i18n.ts.disconnectedFromServer,
				text: i18n.ts.reloadConfirm,
			});
			reloadDialogShowing = false;
			if (!canceled) {
				location.reload();
			}
		}
	});

	if (/ipad|mobile|iphone|android/.test(navigator.userAgent.toLowerCase())) {
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				setTimeout(() => {
					stream.reconnect();
				}, 500);
			}
		});
	}

	for (const plugin of ColdDeviceStorage.get('plugins').filter(p => p.active)) {
		import('@/plugin.js').then(async ({ install }) => {
			// Workaround for https://bugs.webkit.org/show_bug.cgi?id=242740
			await new Promise(r => setTimeout(r, 0));
			install(plugin);
		});
	}

	if ($i) {
		if ($i.isDeleted) {
			alert({
				type: 'warning',
				text: i18n.ts.accountDeletionInProgress,
			});
		}

		// 邪魔
		//const lastUsed = miLocalStorage.getItem('lastUsed');
		//if (lastUsed) {
		//	const lastUsedDate = parseInt(lastUsed, 10);
		//	// 二時間以上前なら
		//	if (Date.now() - lastUsedDate > 1000 * 60 * 60 * 2) {
		//		toast(i18n.tsx.welcomeBackWithName({
		//			name: $i.name || $i.username,
		//		}));
		//	}
		//}
		//miLocalStorage.setItem('lastUsed', Date.now().toString());

		const modifiedVersionMustProminentlyOfferInAgplV3Section13Read = miLocalStorage.getItem('modifiedVersionMustProminentlyOfferInAgplV3Section13Read');
		if (modifiedVersionMustProminentlyOfferInAgplV3Section13Read !== 'true' && instance.repositoryUrl !== 'https://github.com/misskey-dev/misskey') {
			const { dispose } = popup(defineAsyncComponent(() => import('@/components/MkSourceCodeAvailablePopup.vue')), {}, {
				closed: () => dispose(),
			});
		}

		if ('Notification' in window) {
			// 許可を得ていなかったらリクエスト
			if (Notification.permission === 'default') {
				Notification.requestPermission();
			}
		}

		const main = markRaw(stream.useChannel('main', null, 'System'));

		// 自分の情報が更新されたとき
		main.on('meUpdated', i => {
			updateAccount(i);
		});

		main.on('readAllNotifications', () => {
			updateAccount({
				hasUnreadNotification: false,
				unreadNotificationsCount: 0,
			});
		});

		main.on('unreadNotification', () => {
			const unreadNotificationsCount = ($i?.unreadNotificationsCount ?? 0) + 1;
			updateAccount({
				hasUnreadNotification: true,
				unreadNotificationsCount,
			});
		});

		main.on('unreadMention', () => {
			updateAccount({ hasUnreadMentions: true });
		});

		main.on('readAllUnreadMentions', () => {
			updateAccount({ hasUnreadMentions: false });
		});

		main.on('unreadSpecifiedNote', () => {
			updateAccount({ hasUnreadSpecifiedNotes: true });
		});

		main.on('readAllUnreadSpecifiedNotes', () => {
			updateAccount({ hasUnreadSpecifiedNotes: false });
		});

		main.on('readAllAntennas', () => {
			updateAccount({ hasUnreadAntenna: false });
		});

		main.on('unreadAntenna', () => {
			updateAccount({ hasUnreadAntenna: true });
			sound.playMisskeySfx('antenna');
		});

		// トークンが再生成されたとき
		// このままではMisskeyが利用できないので強制的にサインアウトさせる
		main.on('myTokenRegenerated', () => {
			signout();
		});
	}

	// shortcut
	const keymap = {
		'p|n': () => {
			if ($i == null) return;
			post();
		},
		'd': () => {
			defaultStore.set('darkMode', !defaultStore.state.darkMode);
		},
		's': () => {
			mainRouter.push('/search');
		},
	} as const satisfies Keymap;
	document.addEventListener('keydown', makeHotkey(keymap), { passive: false });

	initializeSw();
}
