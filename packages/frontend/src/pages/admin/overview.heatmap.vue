<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_panel" :class="$style.root">
	<MkSelect v-model="src" style="margin: 0 0 12px 0;" small>
		<option value="notes">Notes</option>
		<option value="ap-requests-inbox-received">AP Requests: inboxReceived</option>
		<option value="ap-requests-deliver-succeeded">AP Requests: deliverSucceeded</option>
		<option value="ap-requests-deliver-failed">AP Requests: deliverFailed</option>
	</MkSelect>
	<MkHeatmap :src="src"/>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MkHeatmap, { HeatmapSource } from '@/components/MkHeatmap.vue';
import MkSelect from '@/components/MkSelect.vue';

const src = ref<HeatmapSource>('notes');
</script>

<style lang="scss" module>
.root {
	padding: 20px;
}
</style>
