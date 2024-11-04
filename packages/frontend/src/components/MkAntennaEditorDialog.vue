<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkModalWindow
	ref="dialog"
	:withOkButton="false"
	:width="500"
	:height="550"
	@close="close()"
	@closed="emit('closed')"
>
	<template #header>{{ antenna == null ? i18n.ts.createAntenna : i18n.ts.editAntenna }}</template>
	<XAntennaEditor
		:antenna="antenna"
		@created="onAntennaCreated"
		@updated="onAntennaUpdated"
		@deleted="onAntennaDeleted"
	/>
</MkModalWindow>
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue';
import type { Antenna } from 'misskey-js/entities.js';
import MkModalWindow from '@/components/MkModalWindow.vue';
import XAntennaEditor from '@/components/MkAntennaEditor.vue';
import { i18n } from '@/i18n.js';

defineProps<{
	antenna?: Antenna;
}>();

const emit = defineEmits<{
	(ev: 'created', newAntenna: Antenna): void,
	(ev: 'updated', editedAntenna: Antenna): void,
	(ev: 'deleted'): void,
	(ev: 'closed'): void,
}>();

const dialog = useTemplateRef('dialog');

function onAntennaCreated(newAntenna: Antenna) {
	emit('created', newAntenna);
	dialog.value?.close();
}

function onAntennaUpdated(editedAntenna: Antenna) {
	emit('updated', editedAntenna);
	dialog.value?.close();
}

function onAntennaDeleted() {
	emit('deleted');
	dialog.value?.close();
}

function close() {
	dialog.value?.close();
}
</script>
