/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineAsyncComponent, type Ref, type ShallowRef } from 'vue';
import type { noteVisibilities } from 'misskey-js/consts.js';
import type { Note, Clip, NotesTranslateResponse } from 'misskey-js/entities.js';
import type { MenuItem, MenuDivider } from '@/types/menu.js';
import { $i } from '@/account.js';
import { i18n } from '@/i18n.js';
import { instance } from '@/instance.js';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { copyToClipboard } from '@/scripts/copy-to-clipboard.js';
import { url } from '@/config.js';
import { defaultStore, noteActions } from '@/store.js';
import { miLocalStorage } from '@/local-storage.js';
import { getUserMenu } from '@/scripts/get-user-menu.js';
import { clipsCache, favoritedChannelsCache } from '@/cache.js';
import MkRippleEffect from '@/components/MkRippleEffect.vue';
import { isSupportShare } from '@/scripts/navigator.js';
import { getAppearNote } from '@/scripts/get-appear-note.js';

export async function getNoteClipMenu(props: {
	note: Note;
	isDeleted: Ref<boolean>;
	currentClip?: Clip;
}) {
	function getClipName(clip: Clip) {
		if ($i && clip.userId === $i.id && clip.notesCount != null) {
			return `${clip.name} (${clip.notesCount})`;
		} else {
			return clip.name;
		}
	}

	const appearNote = getAppearNote(props.note);

	const clips = await clipsCache.fetch();
	const menu: MenuItem[] = [...clips.map(clip => ({
		text: getClipName(clip),
		action: () => {
			os.promiseDialog(
				misskeyApi('clips/add-note', { clipId: clip.id, noteId: appearNote.id }),
				null,
				async (err) => {
					if (err.id === '734806c4-542c-463a-9311-15c512803965') {
						const confirm = await os.confirm({
							type: 'warning',
							text: i18n.tsx.confirmToUnclipAlreadyClippedNote({ name: clip.name }),
						});
						if (!confirm.canceled) {
							os.apiWithDialog('clips/remove-note', { clipId: clip.id, noteId: appearNote.id }).then(() => {
								clipsCache.set(clips.map(c => {
									if (c.id === clip.id) {
										return {
											...c,
											notesCount: Math.max(0, ((c.notesCount ?? 0) - 1)),
										};
									} else {
										return c;
									}
								}));
							});
							if (props.currentClip?.id === clip.id) props.isDeleted.value = true;
						}
					} else {
						os.alert({
							type: 'error',
							text: err.message + '\n' + err.id,
						});
					}
				},
			).then(() => {
				clipsCache.set(clips.map(c => {
					if (c.id === clip.id) {
						return {
							...c,
							notesCount: (c.notesCount ?? 0) + 1,
						};
					} else {
						return c;
					}
				}));
			});
		},
	})), { type: 'divider' }, {
		icon: 'ti ti-plus',
		text: i18n.ts.createNew,
		action: async () => {
			const { canceled, result } = await os.form(i18n.ts.createNewClip, {
				name: {
					type: 'string',
					label: i18n.ts.name,
					default: '',
				},
				description: {
					type: 'string',
					required: false,
					multiline: true,
					label: i18n.ts.description,
					default: null,
				},
				isPublic: {
					type: 'boolean',
					label: i18n.ts.public,
					default: false,
				},
			});
			if (canceled) return;

			const clip = await os.apiWithDialog('clips/create', result);

			clipsCache.delete();

			os.apiWithDialog('clips/add-note', { clipId: clip.id, noteId: appearNote.id });
		},
	}];

	return menu;
}

export function getCopyNoteLinkMenu(note: Note, text: string): MenuItem {
	return {
		icon: 'ti ti-link',
		text,
		action: (): void => {
			copyToClipboard(`${url}/notes/${note.id}`);
			os.success();
		},
	};
}

export function getNoteMenu(props: {
	note: Note;
	translation: Ref<NotesTranslateResponse | null>;
	translating: Ref<boolean>;
	isDeleted: Ref<boolean>;
	currentClip?: Clip;
}) {
	const appearNote = getAppearNote(props.note);

	const cleanups = [] as (() => void)[];

	function del(): void {
		os.confirm({
			type: 'warning',
			text: i18n.ts.noteDeleteConfirm,
		}).then(({ canceled }) => {
			if (canceled) return;

			misskeyApi('notes/delete', {
				noteId: appearNote.id,
			});
		});
	}

	function delEdit(): void {
		os.confirm({
			type: 'warning',
			text: i18n.ts.deleteAndEditConfirm,
		}).then(({ canceled }) => {
			if (canceled) return;

			misskeyApi('notes/delete', {
				noteId: appearNote.id,
			});

			os.post({ initialNote: appearNote, renote: appearNote.renote, reply: appearNote.reply, channel: appearNote.channel });
		});
	}

	function toggleThreadMute(mute: boolean): void {
		os.apiWithDialog(mute ? 'notes/thread-muting/create' : 'notes/thread-muting/delete', {
			noteId: appearNote.id,
		});
	}

	function copyContent(): void {
		copyToClipboard(appearNote.text);
		os.success();
	}

	function copyLink(): void {
		copyToClipboard(`${url}/notes/${appearNote.id}`);
		os.success();
	}

	function togglePin(pin: boolean): void {
		os.apiWithDialog(pin ? 'i/pin' : 'i/unpin', {
			noteId: appearNote.id,
		}, undefined);
	}

	async function unclip(): Promise<void> {
		if (!props.currentClip) return;
		os.apiWithDialog('clips/remove-note', { clipId: props.currentClip.id, noteId: appearNote.id });
		props.isDeleted.value = true;
	}

	function share(): void {
		navigator.share({
			title: i18n.tsx.noteOf({ user: appearNote.user.name ?? appearNote.user.username }),
			text: appearNote.text ?? '',
			url: `${url}/notes/${appearNote.id}`,
		});
	}

	function openDetail(): void {
		os.pageWindow(`/notes/${appearNote.id}`);
	}

	async function translate(): Promise<void> {
		if (props.translation.value != null) return;
		props.translating.value = true;
		const res = await misskeyApi('notes/translate', {
			noteId: appearNote.id,
			targetLang: miLocalStorage.getItem('lang') ?? navigator.language,
		});
		props.translating.value = false;
		props.translation.value = res;
	}

	let menu: MenuItem[];

	if ($i) {
		const statePromise = misskeyApi('notes/state', {
			noteId: appearNote.id,
		});

		menu = [
			//#region クリップ解除
			props.currentClip?.userId === $i.id
				? {
					icon: 'ti ti-backspace',
					text: i18n.ts.unclip,
					danger: true,
					action: unclip,
				} :
				undefined,
			props.currentClip?.userId === $i.id
				? { type: 'divider' } as MenuDivider
				: undefined,
			//#endregion
			{
				icon: 'ti ti-info-circle',
				text: i18n.ts.details,
				action: openDetail,
			},
			{
				icon: 'ti ti-copy',
				text: i18n.ts.copyContent,
				action: copyContent,
			},
			getCopyNoteLinkMenu(appearNote, i18n.ts.copyLink),
			appearNote.url !== undefined || appearNote.uri !== undefined
				? {
					icon: 'ti ti-external-link',
					text: i18n.ts.showOnRemote,
					action: () => {
						window.open(appearNote.url ?? appearNote.uri, '_blank', 'noopener');
					},
				}
				: undefined,
			isSupportShare()
				? {
					icon: 'ti ti-share',
					text: i18n.ts.share,
					action: share,
				}
				: undefined,
			$i.policies.canUseTranslator && instance.translatorAvailable
				? {
					icon: 'ti ti-language-hiragana',
					text: i18n.ts.translate,
					action: translate,
				}
				: undefined,
			{ type: 'divider' } as MenuDivider,
			{
				type: 'parent' as const,
				icon: 'ti ti-paperclip',
				text: i18n.ts.clip,
				children: () => getNoteClipMenu(props),
			},
			statePromise.then(state =>
				state.isMutedThread
					? {
						icon: 'ti ti-message-off',
						text: i18n.ts.unmuteThread,
						action: () => toggleThreadMute(false),
					}
					: {
						icon: 'ti ti-message-off',
						text: i18n.ts.muteThread,
						action: () => toggleThreadMute(true),
					}
			),
			appearNote.userId === $i.id
				? ($i.pinnedNoteIds ?? []).includes(appearNote.id)
					? {
						icon: 'ti ti-pinned-off',
						text: i18n.ts.unpin,
						action: () => togglePin(false),
					}
					: {
						icon: 'ti ti-pin',
						text: i18n.ts.pin,
						action: () => togglePin(true),
					}
				: undefined,
			{
				type: 'parent' as const,
				icon: 'ti ti-user',
				text: i18n.ts.user,
				children: async () => {
					const user = appearNote.userId === $i?.id ? $i : await misskeyApi('users/show', { userId: appearNote.userId });
					const { menu, cleanup } = getUserMenu(user);
					cleanups.push(cleanup);
					return menu;
				},
			},
			//#region チャンネル
			appearNote.channel && (appearNote.channel.userId === $i.id || $i.isModerator === true || $i.isAdmin === true)
				? { type: 'divider' } as MenuDivider
				: undefined,
			appearNote.channel && (appearNote.channel.userId === $i.id || $i.isModerator === true || $i.isAdmin === true)
				? {
					type: 'parent' as const,
					icon: 'ti ti-device-tv',
					text: i18n.ts.channel,
					children: async () => {
						const channel = await misskeyApi('channels/show', { channelId: appearNote.channel!.id });

						return [
							channel.pinnedNoteIds.includes(appearNote.id)
								? {
									icon: 'ti ti-pinned-off',
									text: i18n.ts.unpin,
									action: () => os.apiWithDialog('channels/update', {
										channelId: appearNote.channel!.id,
										pinnedNoteIds: channel.pinnedNoteIds.filter(id => id !== appearNote.id),
									}),
								}
								: {
									icon: 'ti ti-pin',
									text: i18n.ts.pin,
									action: () => os.apiWithDialog('channels/update', {
										channelId: appearNote.channel!.id,
										pinnedNoteIds: [...channel.pinnedNoteIds, appearNote.id],
									}),
								},
						];
					},
				}
				: undefined,
			//#endregion
			//#region 削除して編集・削除
			appearNote.userId === $i.id || $i.isModerator === true || $i.isAdmin === true
				? { type: 'divider' } as MenuDivider
				: undefined,
			appearNote.userId === $i.id
				? {
					icon: 'ti ti-edit',
					text: i18n.ts.deleteAndEdit,
					action: delEdit,
				}
				: undefined,
			appearNote.userId === $i.id || $i.isModerator === true || $i.isAdmin === true
				? {
					icon: 'ti ti-trash',
					text: i18n.ts.delete,
					danger: true,
					action: del,
				}
				: undefined,
			//#endregion
		];
	} else {
		menu = [
			{
				icon: 'ti ti-info-circle',
				text: i18n.ts.details,
				action: openDetail,
			},
			{
				icon: 'ti ti-copy',
				text: i18n.ts.copyContent,
				action: copyContent,
			},
			getCopyNoteLinkMenu(appearNote, i18n.ts.copyLink),
			appearNote.url !== undefined || appearNote.uri !== undefined
				? {
					icon: 'ti ti-external-link',
					text: i18n.ts.showOnRemote,
					action: () => {
						window.open(appearNote.url ?? appearNote.uri, '_blank', 'noopener');
					},
				}
				: undefined,
		];
	}

	if (noteActions.length > 0) {
		menu.push(
			{ type: 'divider' },
			...noteActions.map(action => (
				{
					icon: 'ti ti-plug',
					text: action.title,
					action: () => {
						action.handler(appearNote);
					},
				}
			)),
		);
	}

	if (defaultStore.state.devMode) {
		menu.push(
			{ type: 'divider' },
			{
				icon: 'ti ti-id',
				text: i18n.ts.copyNoteId,
				action: () => {
					copyToClipboard(appearNote.id);
				},
			},
		);
	}

	const cleanup = () => {
		if (_DEV_) console.log('note menu cleanup', cleanups);
		for (const cl of cleanups) {
			cl();
		}
	};

	return {
		menu,
		cleanup,
	};
}

type Visibility = (typeof noteVisibilities)[number];

function smallerVisibility(a: Visibility, b: Visibility): Visibility {
	if (a === 'specified' || b === 'specified') return 'specified';
	if (a === 'followers' || b === 'followers') return 'followers';
	if (a === 'home' || b === 'home') return 'home';
	// if (a === 'public' || b === 'public')
	return 'public';
}

export function getRenoteMenu(props: {
	note: Note;
	renoteButton: ShallowRef<HTMLElement | undefined>;
	mock?: boolean;
}) {
	const appearNote = getAppearNote(props.note);

	const normalRenoteItems: MenuItem[] = !appearNote.channel || appearNote.channel.allowRenoteToExternal
		? [
			{
				text: i18n.ts.renote,
				icon: 'ti ti-repeat',
				action: () => {
					const el = props.renoteButton.value;
					if (el) {
						const rect = el.getBoundingClientRect();
						const x = rect.left + (el.offsetWidth / 2);
						const y = rect.top + (el.offsetHeight / 2);
						const { dispose } = os.popup(MkRippleEffect, { x, y }, {
							end: () => dispose(),
						});
					}

					const configuredVisibility = defaultStore.state.rememberNoteVisibility ? defaultStore.state.visibility : defaultStore.state.defaultNoteVisibility;
					const localOnly = defaultStore.state.rememberNoteVisibility ? defaultStore.state.localOnly : defaultStore.state.defaultNoteLocalOnly;

					let visibility = appearNote.visibility;
					visibility = smallerVisibility(visibility, configuredVisibility);
					if (appearNote.channel?.isSensitive) {
						visibility = smallerVisibility(visibility, 'home');
					}

					if (!props.mock) {
						misskeyApi('notes/create', {
							localOnly,
							visibility,
							renoteId: appearNote.id,
						}).then(() => {
							os.toast(i18n.ts.renoted);
						});
					}
				},
			},
			(props.mock)
				? undefined
				: {
					text: i18n.ts.quote,
					icon: 'ti ti-quote',
					action: () => {
						os.post({
							renote: appearNote,
						});
					},
				},
		]
		: [];

	const channelRenoteItems: MenuItem[] = appearNote.channel
		? [
			{
				text: i18n.ts.inChannelRenote,
				icon: 'ti ti-repeat',
				action: () => {
					const el = props.renoteButton.value;
					if (el) {
						const rect = el.getBoundingClientRect();
						const x = rect.left + (el.offsetWidth / 2);
						const y = rect.top + (el.offsetHeight / 2);
						const { dispose } = os.popup(MkRippleEffect, { x, y }, {
							end: () => dispose(),
						});
					}

					if (!props.mock) {
						misskeyApi('notes/create', {
							renoteId: appearNote.id,
							channelId: appearNote.channelId,
						}).then(() => {
							os.toast(i18n.ts.renoted);
						});
					}
				},
			},
			{
				text: i18n.ts.inChannelQuote,
				icon: 'ti ti-quote',
				action: () => {
					if (!props.mock) {
						os.post({
							renote: appearNote,
							channel: appearNote.channel,
						});
					}
				},
			},
		]
		: [];

	const normalExternalChannelRenoteItems: MenuItem[] = !appearNote.channel || appearNote.channel.allowRenoteToExternal
		? [
			{
				type: 'parent',
				icon: 'ti ti-repeat',
				text: appearNote.channel ? i18n.ts.renoteToOtherChannel : i18n.ts.renoteToChannel,
				children: async () => {
					const channels = await favoritedChannelsCache.fetch();

					return channels.filter(
						channel => !appearNote.channelId || channel.id !== appearNote.channelId
					).map((channel) => ({
						text: channel.name,
						action: () => {
							const el = props.renoteButton.value;
							if (el) {
								const rect = el.getBoundingClientRect();
								const x = rect.left + (el.offsetWidth / 2);
								const y = rect.top + (el.offsetHeight / 2);
								const { dispose } = os.popup(MkRippleEffect, { x, y }, {
									end: () => dispose(),
								});
							}

							if (!props.mock) {
								misskeyApi('notes/create', {
									renoteId: appearNote.id,
									channelId: channel.id,
								}).then(() => {
									os.toast(i18n.tsx.renotedToX({ name: channel.name }));
								});
							}
						},
					}));
				},
			},
		]
		: [];

	const renoteItems: MenuItem[] = [
		...normalRenoteItems,
		channelRenoteItems.length > 0 && normalRenoteItems.length > 0
			? { type: 'divider' } as MenuDivider
			: undefined,
		...channelRenoteItems,
		normalExternalChannelRenoteItems.length > 0 && (normalRenoteItems.length > 0 || channelRenoteItems.length > 0)
			? { type: 'divider' } as MenuDivider
			: undefined,
		...normalExternalChannelRenoteItems,
	];

	return {
		menu: renoteItems,
	};
}
