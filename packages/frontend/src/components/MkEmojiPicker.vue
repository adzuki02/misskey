<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="omfetrab" :class="['s' + size, 'w' + width, 'h' + height, { asDrawer, asWindow }]" :style="{ maxHeight: maxHeight ? maxHeight + 'px' : undefined }">
	<input
		ref="searchEl"
		:value="q"
		class="search"
		data-prevent-emoji-insert
		:class="{ filled: q != null && q != '' && q.trim() != '' }"
		:placeholder="i18n.ts.search"
		type="search"
		autocapitalize="off"
		@input="input()"
		@paste.stop="paste"
		@keydown="onKeydown"
	>
	<!-- FirefoxのTabフォーカスが想定外の挙動となるためtabindex="-1"を追加 https://github.com/misskey-dev/misskey/issues/10744 -->
	<div ref="emojisEl" class="emojis" tabindex="-1">
		<div class="tags">
			<button v-for="tag in customEmojiTags" :key="tag" class="tag" :class="{ selected: selectedTags.has(tag) }" @click="() => selectedTags.has(tag) ? selectedTags.delete(tag) : selectedTags.add(tag)">{{ tag }}</button>
		</div>

		<section class="result">
			<div v-if="searchResultCustom.length > 0" class="body">
				<button
					v-for="emoji in searchResultCustom"
					:key="emoji.name"
					class="_button item"
					:disabled="!canReact(emoji)"
					:title="emoji.name"
					tabindex="0"
					@click="chosen(emoji, $event)"
				>
					<MkCustomEmoji class="emoji" :name="emoji.name" :fallbackToImage="true" :forceShowingAnimatedImages="defaultStore.reactiveState.forceShowingAnimatedImagesOnPopup.value"/>
				</button>
			</div>
			<div v-if="searchResultUnicode.length > 0" class="body">
				<button
					v-for="emoji in searchResultUnicode"
					:key="emoji.name"
					class="_button item"
					:title="emoji.name"
					tabindex="0"
					@click="chosen(emoji, $event)"
				>
					<MkEmoji class="emoji" :emoji="emoji.char"/>
				</button>
			</div>
		</section>

		<div class="group index">
			<section v-if="showPinned && (pinned && pinned.length > 0)">
				<div class="body">
					<button
						v-for="emoji in pinnedEmojisDef"
						:key="getKey(emoji)"
						:data-emoji="getKey(emoji)"
						class="_button item"
						:disabled="!canReact(emoji)"
						tabindex="0"
						@pointerenter="computeButtonTitle"
						@click="chosen(emoji, $event)"
					>
						<MkCustomEmoji v-if="!emoji.hasOwnProperty('char')" class="emoji" :name="getKey(emoji)" :normal="true" :forceShowingAnimatedImages="defaultStore.reactiveState.forceShowingAnimatedImagesOnPopup.value"/>
						<MkEmoji v-else class="emoji" :emoji="getKey(emoji)" :normal="true"/>
					</button>
				</div>
			</section>

			<section>
				<header class="_acrylic"><i class="ti ti-clock ti-fw"></i> {{ i18n.ts.recentUsed }}</header>
				<div class="body">
					<button
						v-for="emoji in recentlyUsedEmojisDef"
						:key="getKey(emoji)"
						class="_button item"
						:disabled="!canReact(emoji)"
						:data-emoji="getKey(emoji)"
						@pointerenter="computeButtonTitle"
						@click="chosen(emoji, $event)"
					>
						<MkCustomEmoji v-if="!emoji.hasOwnProperty('char')" class="emoji" :name="getKey(emoji)" :normal="true" :forceShowingAnimatedImages="defaultStore.reactiveState.forceShowingAnimatedImagesOnPopup.value"/>
						<MkEmoji v-else class="emoji" :emoji="getKey(emoji)" :normal="true"/>
					</button>
				</div>
			</section>
		</div>
		<div v-once class="group">
			<header class="_acrylic">{{ i18n.ts.customEmojis }}</header>
			<XSection
				v-for="child in customEmojiFolderRoot.children"
				:key="`custom:${child.value}`"
				:initialShown="false"
				:emojis="computed(() => customEmojis.filter(e => filterCategory(e, child.value)).map(e => `:${e.name}:`))"
				:disabledEmojis="computed(() => customEmojis.filter(e => filterCategory(e, child.value)).filter(e => !canReact(e)).map(e => `:${e.name}:`))"
				:hasChildSection="child.children.length !== 0"
				:customEmojiTree="child.children"
				@chosen="chosen"
			>
				{{ child.value || i18n.ts.other }}
			</XSection>
		</div>
		<div v-once class="group">
			<header class="_acrylic">{{ i18n.ts.emoji }}</header>
			<XSection v-for="category in categories" :key="category" :emojis="emojiCharByCategory.get(category) ?? []" :hasChildSection="false" @chosen="chosen">{{ category }}</XSection>
		</div>
	</div>
</div>
</template>

<script lang="ts" setup>
import { ref, shallowRef, reactive, computed, watch, onMounted } from 'vue';
import * as romajiConv from '@koozaki/romaji-conv';
import type { Note, EmojiSimple } from 'misskey-js/entities.js';
import XSection from '@/components/MkEmojiPicker.section.vue';
import {
	emojilist,
	emojiCharByCategory,
	UnicodeEmojiDef,
	unicodeEmojiCategories as categories,
	getEmojiName,
	CustomEmojiFolderTree,
	getUnicodeEmoji,
} from '@/scripts/emojilist.js';
import MkRippleEffect from '@/components/MkRippleEffect.vue';
import * as os from '@/os.js';
import { isTouchUsing } from '@/scripts/touch.js';
import { deviceKind } from '@/scripts/device-kind.js';
import { i18n } from '@/i18n.js';
import { defaultStore } from '@/store.js';
import { customEmojiCategories, customEmojiTags, customEmojis, customEmojisMap } from '@/custom-emojis.js';
import { $i } from '@/account.js';
import { checkReactionPermissions } from '@/scripts/check-reaction-permissions.js';

const props = withDefaults(defineProps<{
	showPinned?: boolean;
  pinnedEmojis?: string[];
	maxHeight?: number;
	asDrawer?: boolean;
	asWindow?: boolean;
	asReactionPicker?: boolean; // 今は使われてないが将来的に使いそう
	targetNote?: Note;
}>(), {
	showPinned: true,
});

const emit = defineEmits<{
	(ev: 'chosen', v: string): void;
	(ev: 'esc'): void;
}>();

const searchEl = shallowRef<HTMLInputElement>();
const emojisEl = shallowRef<HTMLDivElement>();

const {
	emojiPickerScale,
	emojiPickerWidth,
	emojiPickerHeight,
	recentlyUsedEmojis,
} = defaultStore.reactiveState;

const recentlyUsedEmojisDef = computed(() => {
	return recentlyUsedEmojis.value.map(getDef);
});
const pinnedEmojisDef = computed(() => {
	return pinned.value?.map(getDef);
});

const pinned = computed(() => props.pinnedEmojis);
const size = computed(() => emojiPickerScale.value);
const width = computed(() => emojiPickerWidth.value);
const height = computed(() => emojiPickerHeight.value);
const q = ref<string>('');
const selectedTags = reactive(new Set<string>());
const searchResultCustom = ref<EmojiSimple[]>([]);
const searchResultUnicode = ref<UnicodeEmojiDef[]>([]);

const customEmojiFolderRoot: CustomEmojiFolderTree = { value: '', category: '', children: [] };

function parseAndMergeCategories(input: string, root: CustomEmojiFolderTree): CustomEmojiFolderTree {
	const parts = input.split('/').map(p => p.trim());
	let currentNode: CustomEmojiFolderTree = root;

	for (const part of parts) {
		let existingNode = currentNode.children.find((node) => node.value === part);

		if (!existingNode) {
			const newNode: CustomEmojiFolderTree = { value: part, category: input, children: [] };
			currentNode.children.push(newNode);
			existingNode = newNode;
		}

		currentNode = existingNode;
	}

	return currentNode;
}

customEmojiCategories.value.forEach(ec => {
	if (ec !== null) {
		parseAndMergeCategories(ec, customEmojiFolderRoot);
	}
});

parseAndMergeCategories('', customEmojiFolderRoot);

watch([q, selectedTags], () => {
	if (emojisEl.value) emojisEl.value.scrollTop = 0;

	if (q.value === '' && selectedTags.size === 0) {
		searchResultCustom.value = [];
		searchResultUnicode.value = [];
		return;
	}

	const newQ = q.value.replace(/:/g, '').toLowerCase().trim();

	if (newQ === '' && selectedTags.size === 0) {
		searchResultCustom.value = [];
		searchResultUnicode.value = [];
		return;
	}

	const searchCustom = () => {
		const max = 100;
		const selectedTagsArray = Array.from(selectedTags);
		const emojis = customEmojis.value.filter(emoji => selectedTagsArray.length === 0 || selectedTagsArray.every(selectedTag => emoji.tags.includes(selectedTag)));
		const matches = new Set<EmojiSimple>();

		const exactMatch = emojis.find(emoji => emoji.name === newQ);
		if (exactMatch) matches.add(exactMatch);

		if (newQ.includes(' ')) { // AND検索
			const keywords = newQ.split(' ').filter(s => s !== '');

			// 名前にキーワードが含まれている
			for (const emoji of emojis) {
				if (keywords.every(keyword => emoji.name.includes(keyword))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			// 名前またはエイリアスにキーワードが含まれている
			for (const emoji of emojis) {
				if (keywords.every(keyword => emoji.name.includes(keyword) || emoji.aliases.some(alias => alias.includes(keyword)))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
		} else {
			if (customEmojisMap.has(newQ)) {
				matches.add(customEmojisMap.get(newQ)!);
			}
			if (matches.size >= max) return matches;

			for (const emoji of emojis) {
				if (emoji.aliases.some(alias => alias === newQ)) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const emoji of emojis) {
				if (emoji.name.startsWith(newQ)) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const emoji of emojis) {
				if (emoji.aliases.some(alias => alias.startsWith(newQ))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const emoji of emojis) {
				if (emoji.name.includes(newQ)) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const emoji of emojis) {
				if (emoji.aliases.some(alias => alias.includes(newQ))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			// 日本語のための対応

			// 約物
			// 「？」「！」「…」以外は無視
			const newQ1 = newQ
				.replace(/__q/g, '？') // 「__q」を「？」に
				.replace(/__i/g, '！') // 「__i」を「！」に
				.replace(/__ooo/g, '…') // 「__ooo」を「…」に
				.replace(/_/g, ''); // 「_」を取り除く
			const newQ1j = romajiConv.toHiragana(newQ1);

			// 「ん」の表記を「nn」に合わせる
			// んな、んに、んぬ、んね、んの、んや、んゆ、んよ
			//「minna（みんな）」→「minnna」、「panya（パン屋）」→「pannya」等
			const newQ2 = newQ1.replace(/(?<!n)nn(a|i|u|e|o)/g, 'nnn$1').replace(/(?<!n)ny(a|u|o)/g, 'nny$1');
			const newQ2j = romajiConv.toHiragana(newQ2);

			// 「ん」の表記を「nn」に合わせる
			// んにゃ、んにゅ、んにょ
			// 「hannya（般若）」→「hannnya」等
			const newQ3 = newQ2.replace(/(?<!n)nny(a|u|o)/g, 'nnny$1');
			const newQ3j = romajiConv.toHiragana(newQ3);

			for (const emoji of emojis) {
				if (emoji.aliases.some(alias => alias.includes(newQ1j) || alias.includes(newQ2j) || alias.includes(newQ3j))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
		}

		return matches;
	};

	const searchUnicode = () => {
		const max = 100;
		const emojis = emojilist;
		const matches = new Set<UnicodeEmojiDef>();

		const exactMatch = emojis.find(emoji => emoji.name === newQ);
		if (exactMatch) matches.add(exactMatch);

		if (newQ.includes(' ')) { // AND検索
			const keywords = newQ.split(' ');

			for (const emoji of emojis) {
				if (keywords.every(keyword => emoji.name.includes(keyword))) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const index of Object.values(defaultStore.state.additionalUnicodeEmojiIndexes)) {
				for (const emoji of emojis) {
					if (keywords.every(keyword => index[emoji.char].some(k => k.includes(keyword)))) {
						matches.add(emoji);
						if (matches.size >= max) break;
					}
				}
			}
		} else {
			for (const emoji of emojis) {
				if (emoji.name.startsWith(newQ)) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const index of Object.values(defaultStore.state.additionalUnicodeEmojiIndexes)) {
				for (const emoji of emojis) {
					if (index[emoji.char].some(k => k.startsWith(newQ))) {
						matches.add(emoji);
						if (matches.size >= max) break;
					}
				}
			}

			for (const emoji of emojis) {
				if (emoji.name.includes(newQ)) {
					matches.add(emoji);
					if (matches.size >= max) break;
				}
			}
			if (matches.size >= max) return matches;

			for (const index of Object.values(defaultStore.state.additionalUnicodeEmojiIndexes)) {
				for (const emoji of emojis) {
					if (index[emoji.char].some(k => k.includes(newQ))) {
						matches.add(emoji);
						if (matches.size >= max) break;
					}
				}
			}
		}

		return matches;
	};

	searchResultCustom.value = Array.from(searchCustom());
	searchResultUnicode.value = selectedTags.size > 0 ? [] : Array.from(searchUnicode());
});

function canReact(emoji: EmojiSimple | UnicodeEmojiDef | string): boolean {
	return !props.targetNote || checkReactionPermissions($i!, props.targetNote, emoji);
}

function filterCategory(emoji: EmojiSimple, category: string): boolean {
	return category === '' ? (emoji.category === 'null' || !emoji.category) : emoji.category === category;
}

function focus() {
	if (!['smartphone', 'tablet'].includes(deviceKind) && !isTouchUsing) {
		searchEl.value?.focus({
			preventScroll: true,
		});
	}
}

function reset() {
	if (emojisEl.value) emojisEl.value.scrollTop = 0;
	q.value = '';
	selectedTags.clear();
}

function getKey(emoji: string | EmojiSimple | UnicodeEmojiDef): string {
	return typeof emoji === 'string' ? emoji : 'char' in emoji ? emoji.char : `:${emoji.name}:`;
}

function getDef(emoji: string): string | EmojiSimple | UnicodeEmojiDef {
	if (emoji.includes(':')) {
		// カスタム絵文字が存在する場合はその情報を持つオブジェクトを返し、
		// サーバの管理画面から削除された等で情報が見つからない場合は名前の文字列をそのまま返しておく（undefinedを返すとエラーになるため）
		const name = emoji.replaceAll(':', '');
		return customEmojisMap.get(name) ?? emoji;
	} else {
		return getUnicodeEmoji(emoji);
	}
}

/** @see MkEmojiPicker.section.vue */
function computeButtonTitle(ev: MouseEvent): void {
	const elm = ev.target as HTMLElement;
	const emoji = elm.dataset.emoji as string;
	elm.title = getEmojiName(emoji);
}

function chosen(emoji: any, ev?: MouseEvent) {
	const el = ev && (ev.currentTarget ?? ev.target) as HTMLElement | null | undefined;
	if (el) {
		const rect = el.getBoundingClientRect();
		const x = rect.left + (el.offsetWidth / 2);
		const y = rect.top + (el.offsetHeight / 2);
		const { dispose } = os.popup(MkRippleEffect, { x, y }, {
			end: () => dispose(),
		});
	}

	const key = getKey(emoji);
	emit('chosen', key);

	// 最近使った絵文字更新
	if (!pinned.value?.includes(key)) {
		let recents = defaultStore.state.recentlyUsedEmojis;
		recents = recents.filter((emoji: any) => emoji !== key);
		recents.unshift(key);
		defaultStore.set('recentlyUsedEmojis', recents.splice(0, 32));
	}
}

function input(): void {
	// Using custom input event instead of v-model to respond immediately on
	// Android, where composition happens on all languages
	// (v-model does not update during composition)
	q.value = searchEl.value?.value ?? '';
}

function paste(event: ClipboardEvent): void {
	const pasted = event.clipboardData?.getData('text') ?? '';
	if (done(pasted)) {
		event.preventDefault();
	}
}

function onKeydown(ev: KeyboardEvent) {
	if (ev.isComposing || ev.key === 'Process' || ev.keyCode === 229) return;
	if (ev.key === 'Enter') {
		ev.preventDefault();
		ev.stopPropagation();
		done();
	}
	if (ev.key === 'Escape') {
		ev.preventDefault();
		ev.stopPropagation();
		emit('esc');
	}
}

function done(query?: string): boolean | void {
	if (query == null) query = q.value.trim();
	if (query == null || typeof query !== 'string') return;

	const q2 = query.replace(/:/g, '');
	const exactMatchCustom = customEmojisMap.get(q2);
	if (exactMatchCustom) {
		chosen(exactMatchCustom);
		return true;
	}
	const exactMatchUnicode = emojilist.find(emoji => emoji.char === q2 || emoji.name === q2);
	if (exactMatchUnicode) {
		chosen(exactMatchUnicode);
		return true;
	}
	if (searchResultCustom.value.length > 0) {
		chosen(searchResultCustom.value[0]);
		return true;
	}
	if (searchResultUnicode.value.length > 0) {
		chosen(searchResultUnicode.value[0]);
		return true;
	}
}

onMounted(() => {
	focus();
});

defineExpose({
	focus,
	reset,
});
</script>

<style lang="scss" scoped>
.omfetrab {
	$pad: 8px;

	display: flex;
	flex-direction: column;

	&.s1 {
		--eachSize: 40px;
	}

	&.s2 {
		--eachSize: 45px;
	}

	&.s3 {
		--eachSize: 50px;
	}

	&.w1 {
		width: calc((var(--eachSize) * 5) + (#{$pad} * 2));
		--columns: 1fr 1fr 1fr 1fr 1fr;
	}

	&.w2 {
		width: calc((var(--eachSize) * 6) + (#{$pad} * 2));
		--columns: 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	&.w3 {
		width: calc((var(--eachSize) * 7) + (#{$pad} * 2));
		--columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	&.w4 {
		width: calc((var(--eachSize) * 8) + (#{$pad} * 2));
		--columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	&.w5 {
		width: calc((var(--eachSize) * 9) + (#{$pad} * 2));
		--columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
	}

	&.h1 {
		height: calc((var(--eachSize) * 4) + (#{$pad} * 2));
	}

	&.h2 {
		height: calc((var(--eachSize) * 6) + (#{$pad} * 2));
	}

	&.h3 {
		height: calc((var(--eachSize) * 8) + (#{$pad} * 2));
	}

	&.h4 {
		height: calc((var(--eachSize) * 10) + (#{$pad} * 2));
	}

	&.asDrawer {
		width: 100% !important;

		> .emojis {
			::v-deep(section) {
				> header {
					height: 32px;
					line-height: 32px;
					padding: 0 12px;
					font-size: 15px;
				}

				> .body {
					display: grid;
					grid-template-columns: var(--columns);
					font-size: 30px;

					> .item {
						aspect-ratio: 1 / 1;
						width: auto;
						height: auto;
						min-width: 0;

						&:disabled {
							cursor: not-allowed;
							background: linear-gradient(-45deg, transparent 0% 48%, var(--X6) 48% 52%, transparent 52% 100%);
							opacity: 1;

							> .emoji {
								filter: grayscale(1);
								mix-blend-mode: exclusion;
								opacity: 0.8;
							}
						}
					}
				}
			}
		}
	}

	&.asWindow {
		width: 100% !important;
		height: 100% !important;

		> .emojis {
			::v-deep(section) {
				> .body {
					display: grid;
					grid-template-columns: var(--columns);
					font-size: 30px;

					> .item {
						aspect-ratio: 1 / 1;
						width: auto;
						height: auto;
						min-width: 0;
						padding: 0;

						&:disabled {
							cursor: not-allowed;
							background: linear-gradient(-45deg, transparent 0% 48%, var(--X6) 48% 52%, transparent 52% 100%);
							opacity: 1;

							> .emoji {
								filter: grayscale(1);
								mix-blend-mode: exclusion;
								opacity: 0.8;
							}
						}
					}
				}
			}
		}
	}

	> .search {
		width: 100%;
		padding: 12px;
		box-sizing: border-box;
		font-size: 1em;
		outline: none;
		border: none;
		background: transparent;
		color: var(--fg);

		&:not(:focus):not(.filled) {
			margin-bottom: env(safe-area-inset-bottom, 0px);
		}

		&:not(.filled) {
			order: 1;
			z-index: 2;
			box-shadow: 0px -1px 0 0px var(--divider);
		}
	}

	> .emojis {
		height: 100%;
		overflow-y: auto;
		overflow-x: hidden;

		scrollbar-width: none;

		&::-webkit-scrollbar {
			display: none;
		}

		> .tags {
			width: 100%;
			padding: 12px;
			box-sizing: border-box;
			border-bottom: solid 0.5px var(--divider);

			> .tag {
				display: inline-block;
				color: var(--fg);
				background: var(--buttonBg);
				border: 1px solid var(--buttonBg);
				border-radius: 5px;
				padding-block: 2px;
				padding-inline: 0.5em;
				padding-block: 0.2rem;
				margin-inline: 4px;
				margin-block: 4px;

				&:hover {
					cursor: pointer;
				}

				&.selected {
					border-color: var(--accent);
				}
			}
		}

		> .group {
			&:not(.index) {
				padding: 4px 0 8px 0;
				border-top: solid 0.5px var(--divider);
			}

			> header {
				/*position: sticky;
				top: 0;
				left: 0;*/
				height: 32px;
				line-height: 32px;
				z-index: 2;
				padding: 0 8px;
				font-size: 12px;
			}
		}

		::v-deep(section) {
			> header {
				position: sticky;
				top: 0;
				left: 0;
				line-height: 28px;
				z-index: 1;
				padding: 0 8px;
				font-size: 12px;
				cursor: pointer;

				&:hover {
					color: var(--accent);
				}
			}

			> .body {
				position: relative;
				padding: $pad;

				> .item {
					position: relative;
					padding: 0 3px;
					width: var(--eachSize);
					height: var(--eachSize);
					contain: strict;
					border-radius: 4px;
					font-size: 24px;

					&:hover {
						background: rgba(0, 0, 0, 0.05);
					}

					&:active {
						background: var(--accent);
						box-shadow: inset 0 0.15em 0.3em rgba(27, 31, 35, 0.15);
					}

					&:disabled {
						cursor: not-allowed;
						background: linear-gradient(-45deg, transparent 0% 48%, var(--X6) 48% 52%, transparent 52% 100%);
						opacity: 1;

						> .emoji {
							filter: grayscale(1);
							mix-blend-mode: exclusion;
							opacity: 0.8;
						}
					}

					> .emoji {
						height: 1.25em;
						vertical-align: -.25em;
						pointer-events: none;
						width: 100%;
						object-fit: contain;
					}
				}
			}

			&.result {
				border-bottom: solid 0.5px var(--divider);

				&:empty {
					display: none;
				}
			}
		}
	}
}
</style>
