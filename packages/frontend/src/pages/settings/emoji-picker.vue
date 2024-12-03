<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_gaps_m">
	<MkFolder :defaultOpen="true">
		<template #icon><i class="ti ti-pin"></i></template>
		<template #label>{{ i18n.ts.pinned }} ({{ i18n.ts.reaction }})</template>
		<template #caption>{{ i18n.ts.pinnedEmojisForReactionSettingDescription }}</template>

		<div class="_gaps">
			<div>
				<div v-panel style="border-radius: 6px;">
					<Sortable
						v-model="pinnedEmojisForReaction"
						:class="$style.emojis"
						:itemKey="item => item"
						:animation="150"
						:delay="100"
						:delayOnTouchOnly="true"
					>
						<template #item="{element}">
							<button class="_button" :class="$style.emojisItem" @click="removeReaction(element, $event)">
								<MkCustomEmoji v-if="element[0] === ':'" :name="element" :normal="true" :fallbackToImage="true"/>
								<MkEmoji v-else :emoji="element" :normal="true"/>
							</button>
						</template>
						<template #footer>
							<button class="_button" :class="$style.emojisAdd" @click="chooseReaction">
								<i class="ti ti-plus"></i>
							</button>
						</template>
					</Sortable>
				</div>
				<div :class="$style.editorCaption">{{ i18n.ts.reactionSettingDescription2 }}</div>
			</div>

			<div class="_buttons">
				<MkButton inline @click="previewReaction"><i class="ti ti-eye"></i> {{ i18n.ts.preview }}</MkButton>
				<MkButton inline danger @click="setDefaultReaction"><i class="ti ti-reload"></i> {{ i18n.ts.default }}</MkButton>
				<MkButton inline danger @click="overwriteFromPinnedEmojis"><i class="ti ti-copy"></i> {{ i18n.ts.overwriteFromPinnedEmojis }}</MkButton>
			</div>
		</div>
	</MkFolder>

	<MkFolder>
		<template #icon><i class="ti ti-pin"></i></template>
		<template #label>{{ i18n.ts.pinned }} ({{ i18n.ts.general }})</template>
		<template #caption>{{ i18n.ts.pinnedEmojisSettingDescription }}</template>

		<div class="_gaps">
			<div>
				<div v-panel style="border-radius: 6px;">
					<Sortable
						v-model="pinnedEmojis"
						:class="$style.emojis"
						:itemKey="item => item"
						:animation="150"
						:delay="100"
						:delayOnTouchOnly="true"
					>
						<template #item="{element}">
							<button class="_button" :class="$style.emojisItem" @click="removeEmoji(element, $event)">
								<MkCustomEmoji v-if="element[0] === ':'" :name="element" :normal="true" :fallbackToImage="true"/>
								<MkEmoji v-else :emoji="element" :normal="true"/>
							</button>
						</template>
						<template #footer>
							<button class="_button" :class="$style.emojisAdd" @click="chooseEmoji">
								<i class="ti ti-plus"></i>
							</button>
						</template>
					</Sortable>
				</div>
				<div :class="$style.editorCaption">{{ i18n.ts.reactionSettingDescription2 }}</div>
			</div>

			<div class="_buttons">
				<MkButton inline @click="previewEmoji"><i class="ti ti-eye"></i> {{ i18n.ts.preview }}</MkButton>
				<MkButton inline danger @click="setDefaultEmoji"><i class="ti ti-reload"></i> {{ i18n.ts.default }}</MkButton>
				<MkButton inline danger @click="overwriteFromPinnedEmojisForReaction"><i class="ti ti-copy"></i> {{ i18n.ts.overwriteFromPinnedEmojisForReaction }}</MkButton>
			</div>
		</div>
	</MkFolder>

	<FormSection>
		<template #label>{{ i18n.ts.emojiPickerDisplay }}</template>

		<div class="_gaps_m">
			<MkRadios v-model="emojiPickerScale">
				<template #label>{{ i18n.ts.size }}</template>
				<option :value="1">{{ i18n.ts.small }}</option>
				<option :value="2">{{ i18n.ts.medium }}</option>
				<option :value="3">{{ i18n.ts.large }}</option>
			</MkRadios>

			<MkRadios v-model="emojiPickerWidth">
				<template #label>{{ i18n.ts.numberOfColumn }}</template>
				<option :value="1">5</option>
				<option :value="2">6</option>
				<option :value="3">7</option>
				<option :value="4">8</option>
				<option :value="5">9</option>
			</MkRadios>

			<MkRadios v-model="emojiPickerHeight">
				<template #label>{{ i18n.ts.height }}</template>
				<option :value="1">{{ i18n.ts.small }}</option>
				<option :value="2">{{ i18n.ts.medium }}</option>
				<option :value="3">{{ i18n.ts.large }}</option>
				<option :value="4">{{ i18n.ts.large }}+</option>
			</MkRadios>

			<MkSelect v-model="emojiPickerStyle">
				<template #label>{{ i18n.ts.style }}</template>
				<template #caption>{{ i18n.ts.needReloadToApply }}</template>
				<option value="auto">{{ i18n.ts.auto }}</option>
				<option value="popup">{{ i18n.ts.popup }}</option>
				<option value="drawer">{{ i18n.ts.drawer }}</option>
			</MkSelect>

			<MkSwitch v-model="emojiPickerTagSection">
				{{ i18n.ts.emojiPickerTagSection }}
			</MkSwitch>

			<MkSwitch v-model="emojiPickerTagOneline">
				{{ i18n.ts.emojiPickerTagOneline }}
			</MkSwitch>

			<MkFolder>
				<template #icon><i class="ti ti-pin"></i></template>
				<template #label>{{ i18n.ts.emojiPickerTags }}</template>

				<div :class="$style.tagPairsRoot">
					<div :class="$style.tagPairsMargin">
						<MkButton inline style="margin-right: 8px;" @click="addPinnedTagPair"><i class="ti ti-plus"></i> {{ i18n.ts.add }}</MkButton>
						<MkButton v-if="!pinnedTagPairsEditMode" inline danger style="margin-right: 8px;" @click="pinnedTagPairsEditMode = !pinnedTagPairsEditMode"><i class="ti ti-trash"></i> {{ i18n.ts.delete }}</MkButton>
						<MkButton v-else inline style="margin-right: 8px;" @click="pinnedTagPairsEditMode = !pinnedTagPairsEditMode"><i class="ti ti-arrows-sort"></i> {{ i18n.ts.rearrange }}</MkButton>
						<MkButton inline primary @click="savePinnedTagPairs"><i class="ti ti-check"></i> {{ i18n.ts.save }}</MkButton>
					</div>

					<Sortable
						v-model="pinnedTagPairs"
						class="_gaps_s"
						itemKey="id"
						:animation="150"
						:handle="'.' + $style.dragItemHandle"
						@start="e => e.item.classList.add('active')"
						@end="e => e.item.classList.remove('active')"
					>
						<template #item="{element, index}">
							<div :class="$style.tagPairsDragItem">
								<button v-if="!pinnedTagPairsEditMode" class="_button" :class="$style.dragItemHandle" tabindex="-1"><i class="ti ti-menu"></i></button>
								<button v-if="pinnedTagPairsEditMode" class="_button" :class="$style.dragItemRemove" @click="deleteTagPair(index)"><i class="ti ti-x"></i></button>
								<div :class="$style.dragItemForm">
									<FormSplit :minWidth="200">
										<MkInput v-model="element.name" :mfmAutocomplete="['emoji']" small>
											<template #label>{{ i18n.ts._profile.metadataLabel }}</template>
										</MkInput>
										<MkSelect v-model="element.tag" small>
											<template #label>{{ i18n.ts.tags }}</template>
											<option v-for="x in customEmojiTags" :key="x" :value="x">{{ x }}</option>
										</MkSelect>
									</FormSplit>
								</div>
							</div>
						</template>
					</Sortable>

					<div :class="$style.tagPairsCaption">{{ i18n.ts.emojiPickerTagsDescription }}</div>
				</div>
			</MkFolder>
		</div>
	</FormSection>

	<FormSection>
		<div class="_gaps">
			<MkFolder>
				<template #label>{{ i18n.ts.additionalEmojiDictionary }}</template>
				<div class="_buttons">
					<template v-for="lang in emojiIndexLangs" :key="lang">
						<MkButton v-if="defaultStore.reactiveState.additionalUnicodeEmojiIndexes.value[lang]" danger @click="removeEmojiIndex(lang)"><i class="ti ti-trash"></i> {{ i18n.ts.remove }} ({{ getEmojiIndexLangName(lang) }})</MkButton>
						<MkButton v-else @click="downloadEmojiIndex(lang)"><i class="ti ti-download"></i> {{ getEmojiIndexLangName(lang) }}{{ defaultStore.reactiveState.additionalUnicodeEmojiIndexes.value[lang] ? ` (${ i18n.ts.installed })` : '' }}</MkButton>
					</template>
				</div>
			</MkFolder>
		</div>
	</FormSection>
</div>
</template>

<script lang="ts" setup>
import { computed, ref, type Ref, watch } from 'vue';
import Sortable from 'vuedraggable';
import MkRadios from '@/components/MkRadios.vue';
import MkButton from '@/components/MkButton.vue';
import MkInput from '@/components/MkInput.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import FormSection from '@/components/form/section.vue';
import FormSplit from '@/components/form/split.vue';
import MkSelect from '@/components/MkSelect.vue';
import * as os from '@/os.js';
import { langs } from '@/config.js';
import { defaultStore } from '@/store.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { deepClone } from '@/scripts/clone.js';
import { reactionPicker } from '@/scripts/reaction-picker.js';
import { emojiPicker } from '@/scripts/emoji-picker.js';
import { customEmojiTags } from '@/custom-emojis';
import MkCustomEmoji from '@/components/global/MkCustomEmoji.vue';
import MkEmoji from '@/components/global/MkEmoji.vue';
import MkFolder from '@/components/MkFolder.vue';

const emojiIndexLangs = ['en-US'] as const;

function getEmojiIndexLangName(targetLang: typeof emojiIndexLangs[number]) {
	if (langs.find(x => x[0] === targetLang)) {
		return langs.find(x => x[0] === targetLang)![1];
	} else {
		return targetLang;
	}
}

function downloadEmojiIndex(lang: typeof emojiIndexLangs[number]) {
	async function main() {
		const currentIndexes = defaultStore.state.additionalUnicodeEmojiIndexes;

		function download() {
			switch (lang) {
				case 'en-US': return import('../../unicode-emoji-indexes/en-US.json').then(x => x.default);
				default: throw new Error('unrecognized lang: ' + lang);
			}
		}

		currentIndexes[lang] = await download();
		await defaultStore.set('additionalUnicodeEmojiIndexes', currentIndexes);
	}

	os.promiseDialog(main());
}

function removeEmojiIndex(lang: string) {
	async function main() {
		const currentIndexes = defaultStore.state.additionalUnicodeEmojiIndexes;
		delete currentIndexes[lang];
		await defaultStore.set('additionalUnicodeEmojiIndexes', currentIndexes);
	}

	os.promiseDialog(main());
}

const pinnedEmojisForReaction: Ref<string[]> = ref(deepClone(defaultStore.state.reactions));
const pinnedEmojis: Ref<string[]> = ref(deepClone(defaultStore.state.pinnedEmojis));
const pinnedTagPairs: Ref<({ name: string, tag: string })[]> = ref(Object.entries(defaultStore.state.emojiPickerTagPairs).map(([name, tag]) => ({ name, tag })));
const pinnedTagPairsEditMode = ref(false);

const emojiPickerScale = computed(defaultStore.makeGetterSetter('emojiPickerScale'));
const emojiPickerWidth = computed(defaultStore.makeGetterSetter('emojiPickerWidth'));
const emojiPickerHeight = computed(defaultStore.makeGetterSetter('emojiPickerHeight'));
const emojiPickerStyle = computed(defaultStore.makeGetterSetter('emojiPickerStyle'));
const emojiPickerTagSection = computed(defaultStore.makeGetterSetter('emojiPickerTagSection'));
const emojiPickerTagOneline = computed(defaultStore.makeGetterSetter('emojiPickerTagOneline'));

const removeReaction = (reaction: string, ev: MouseEvent) => remove(pinnedEmojisForReaction, reaction, ev);
const chooseReaction = (ev: MouseEvent) => pickEmoji(pinnedEmojisForReaction, ev);
const setDefaultReaction = () => setDefault(pinnedEmojisForReaction);

const removeEmoji = (reaction: string, ev: MouseEvent) => remove(pinnedEmojis, reaction, ev);
const chooseEmoji = (ev: MouseEvent) => pickEmoji(pinnedEmojis, ev);
const setDefaultEmoji = () => setDefault(pinnedEmojis);

const addPinnedTagPair = () => {
	pinnedTagPairs.value.push({
		name: '',
		tag: '',
	});
};

if (pinnedTagPairs.value.length === 0) {
	addPinnedTagPair();
}

const deleteTagPair = (index: number) => {
	pinnedTagPairs.value.splice(index, 1);
};

const savePinnedTagPairs = () => {
	defaultStore.set('emojiPickerTagPairs', Object.fromEntries(pinnedTagPairs.value.filter(pair => pair.name !== '' && customEmojiTags.value.includes(pair.tag)).map(pair => [pair.name, pair.tag])));
};

function previewReaction(ev: MouseEvent) {
	reactionPicker.show(getHTMLElement(ev), undefined);
}

function previewEmoji(ev: MouseEvent) {
	emojiPicker.show(getHTMLElement(ev));
}

async function overwriteFromPinnedEmojis() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.ts.overwriteContentConfirm,
	});

	if (canceled) {
		return;
	}

	pinnedEmojisForReaction.value = [...pinnedEmojis.value];
}

async function overwriteFromPinnedEmojisForReaction() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.ts.overwriteContentConfirm,
	});

	if (canceled) {
		return;
	}

	pinnedEmojis.value = [...pinnedEmojisForReaction.value];
}

function remove(itemsRef: Ref<string[]>, reaction: string, ev: MouseEvent) {
	os.popupMenu([{
		text: i18n.ts.remove,
		action: () => {
			itemsRef.value = itemsRef.value.filter(x => x !== reaction);
		},
	}], getHTMLElement(ev));
}

async function setDefault(itemsRef: Ref<string[]>) {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.ts.resetAreYouSure,
	});
	if (canceled) return;

	itemsRef.value = deepClone(defaultStore.def.reactions.default);
}

async function pickEmoji(itemsRef: Ref<string[]>, ev: MouseEvent) {
	os.pickEmoji(getHTMLElement(ev), {
		showPinned: false,
	}).then(it => {
		const emoji = it;
		if (!itemsRef.value.includes(emoji)) {
			itemsRef.value.push(emoji);
		}
	});
}

function getHTMLElement(ev: MouseEvent): HTMLElement {
	const target = ev.currentTarget ?? ev.target;
	return target as HTMLElement;
}

watch(pinnedEmojisForReaction, () => {
	defaultStore.set('reactions', pinnedEmojisForReaction.value);
}, {
	deep: true,
});

watch(pinnedEmojis, () => {
	defaultStore.set('pinnedEmojis', pinnedEmojis.value);
}, {
	deep: true,
});

definePageMetadata(() => ({
	title: i18n.ts.emojiPicker,
	icon: 'ti ti-mood-happy',
}));
</script>

<style lang="scss" module>
.tab {
	margin: calc(var(--MI-margin) / 2) 0;
	padding: calc(var(--MI-margin) / 2) 0;
	background: var(--MI_THEME-bg);
}

.emojis {
  padding: 12px;
  font-size: 1.1em;
}

.emojisItem {
  display: inline-block;
  padding: 8px;
  cursor: move;
}

.emojisAdd {
  display: inline-block;
  padding: 8px;
}

.editorCaption {
	font-size: 0.85em;
	padding: 8px 0 0 0;
	color: var(--MI_THEME-fgTransparentWeak);
}

.tagPairsRoot {
	container-type: inline-size;
}

.tagPairsMargin {
	margin-bottom: 1.5em;
}

.tagPairsCaption {
	font-size: 0.85em;
	padding: 8px 0 0 0;
	color: var(--MI_THEME-fgTransparentWeak);
}

.tagPairsDragItem {
	display: flex;
	padding-bottom: .75em;
	align-items: flex-end;
	border-bottom: solid 0.5px var(--MI_THEME-divider);

	&:last-child {
		border-bottom: 0;
	}

	/* (drag button) 32px + (drag button margin) 8px + (input width) 200px * 2 + (input gap) 12px = 452px */
	@container (max-width: 452px) {
		align-items: center;
	}
}

.dragItemHandle {
	cursor: grab;
	width: 32px;
	height: 32px;
	margin: 0 8px 0 0;
	opacity: 0.5;
	flex-shrink: 0;

	&:active {
		cursor: grabbing;
	}
}

.dragItemRemove {
	@extend .dragItemHandle;

	color: #ff2a2a;
	opacity: 1;
	cursor: pointer;

	&:hover, &:focus {
		opacity: .7;
	}

	&:active {
		cursor: pointer;
	}
}

.dragItemForm {
	flex-grow: 1;
}
</style>
