<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader/></template>
	<MkSpacer :contentMax="700">
		<div class="_gaps">
			<MkInput v-model="title">
				<template #label>{{ i18n.ts._play.title }}</template>
			</MkInput>
			<MkTextarea v-model="summary" :mfmAutocomplete="true" :mfmPreview="true">
				<template #label>{{ i18n.ts._play.summary }}</template>
			</MkTextarea>
			<MkCodeEditor v-model="script" lang="is">
				<template #label>{{ i18n.ts._play.script }}</template>
			</MkCodeEditor>
			<MkSelect v-model="visibility">
				<template #label>{{ i18n.ts.visibility }}</template>
				<template #caption>{{ i18n.ts._play.visibilityDescription }}</template>
				<option :key="'public'" :value="'public'">{{ i18n.ts.public }}</option>
				<option :key="'private'" :value="'private'">{{ i18n.ts.private }}</option>
			</MkSelect>
			<div class="_buttons">
				<MkButton primary @click="save"><i class="ti ti-check"></i> {{ i18n.ts.save }}</MkButton>
				<MkButton @click="show"><i class="ti ti-eye"></i> {{ i18n.ts.show }}</MkButton>
				<MkButton v-if="flash" danger @click="del"><i class="ti ti-trash"></i> {{ i18n.ts.delete }}</MkButton>
			</div>
		</div>
	</MkSpacer>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { AISCRIPT_VERSION } from '@syuilo/aiscript';
import type { Flash } from 'misskey-js/entities.js';
import MkButton from '@/components/MkButton.vue';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import MkTextarea from '@/components/MkTextarea.vue';
import MkCodeEditor from '@/components/MkCodeEditor.vue';
import MkInput from '@/components/MkInput.vue';
import MkSelect from '@/components/MkSelect.vue';
import { useRouter } from '@/router/supplier.js';

const PRESET_DEFAULT = `/// @ ${AISCRIPT_VERSION}

var name = ""

Ui:render([
	Ui:C:textInput({
		label: "Your name"
		onInput: @(v) { name = v }
	})
	Ui:C:button({
		text: "Hello"
		onClick: @() {
			Mk:dialog(null, \`Hello, {name}!\`)
		}
	})
])
`;

const router = useRouter();

const props = defineProps<{
	id?: string;
}>();

const flash = ref<Flash>();

if (props.id) {
	flash.value = await misskeyApi('flash/show', {
		flashId: props.id,
	});
}

const title = ref(flash.value?.title ?? 'New Play');
const summary = ref(flash.value?.summary ?? '');
const visibility = ref<'private' | 'public'>(flash.value?.visibility ?? 'public');
const script = ref(flash.value?.script ?? PRESET_DEFAULT);

async function save() {
	if (flash.value && props.id) {
		os.apiWithDialog('flash/update', {
			flashId: props.id,
			title: title.value,
			summary: summary.value,
			script: script.value,
			visibility: visibility.value,
		});
	} else {
		const created = await os.apiWithDialog('flash/create', {
			title: title.value,
			summary: summary.value,
			permissions: [],
			script: script.value,
			visibility: visibility.value,
		});
		router.push('/play/' + created.id + '/edit');
	}
}

function show() {
	if (flash.value == null) {
		os.alert({
			text: 'Please save',
		});
	} else {
		os.pageWindow(`/play/${flash.value.id}`);
	}
}

async function del() {
	if (!flash.value || !props.id) return;

	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.tsx.deleteAreYouSure({ x: flash.value.title }),
	});
	if (canceled) return;

	await os.apiWithDialog('flash/delete', {
		flashId: props.id,
	});
	router.push('/play');
}

definePageMetadata(() => ({
	title: flash.value ? `${i18n.ts._play.edit}: ${flash.value.title}` : i18n.ts._play.new,
}));
</script>
