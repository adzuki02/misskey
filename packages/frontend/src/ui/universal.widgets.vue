<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div>
	<XWidgets :edit="editMode" :widgets="widgets" @addWidget="addWidget" @removeWidget="removeWidget" @updateWidget="updateWidget" @updateWidgets="updateWidgets" @exit="editMode = false"/>

	<button v-if="editMode" class="_textButton" style="font-size: 0.9em;" @click="editMode = false"><i class="ti ti-check"></i> {{ i18n.ts.editWidgetsExit }}</button>
	<button v-else class="_textButton" data-cy-widget-edit :class="$style.edit" style="font-size: 0.9em;" @click="editMode = true"><i class="ti ti-pencil"></i> {{ i18n.ts.editWidgets }}</button>
</div>
</template>

<script lang="ts">
import { computed, ref } from 'vue';
const editMode = ref(false);
</script>

<script lang="ts" setup>
import XWidgets, { Widget } from '@/components/MkWidgets.vue';
import { i18n } from '@/i18n.js';
import { defaultStore } from '@/store.js';
import { widgets as widgetDefs } from '@/widgets/index.js';

const widgets = computed(() => {
	return defaultStore.reactiveState.widgets.value;
});

function addWidget(widget: Widget) {
	defaultStore.set('widgets', [
		widget,
		...defaultStore.state.widgets,
	].filter(w => widgetDefs.includes(w.name)));
}

function removeWidget(widget) {
	defaultStore.set('widgets', defaultStore.state.widgets.filter(w => w.id !== widget.id).filter(w => widgetDefs.includes(w.name)));
}

function updateWidget(widget: Pick<Widget, 'id'> & Partial<Widget>) {
	defaultStore.set('widgets', defaultStore.state.widgets.map(w => w.id === widget.id ? {
		...w,
		data: widget.data ?? {},
	} : w).filter(w => widgetDefs.includes(w.name)));
}

function updateWidgets(thisWidgets: Widget[]) {
	defaultStore.set('widgets', thisWidgets.filter(w => widgetDefs.includes(w.name)));
}
</script>

<style lang="scss" module>
.edit {
	width: 100%;
}
</style>
