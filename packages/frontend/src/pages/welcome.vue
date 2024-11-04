<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div v-if="instance">
	<XSetup v-if="instance.requireSetup"/>
	<XEntrance v-else/>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import XSetup from './welcome.setup.vue';
import XEntrance from './welcome.entrance.a.vue';
import type { MetaDetailed } from 'misskey-js/entities.js';
import { instanceName } from '@/config.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { fetchInstance } from '@/instance.js';

const instance = ref<MetaDetailed>();

fetchInstance(true).then((res) => {
	instance.value = res;
});

definePageMetadata(() => ({
	title: instanceName,
	icon: null,
}));
</script>
