<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader/></template>
	<MkAntennaEditor @created="onAntennaCreated"/>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { antennasCache } from '@/cache.js';
import { useRouter } from '@/router/supplier.js';
import MkAntennaEditor from '@/components/MkAntennaEditor.vue';

const router = useRouter();

function onAntennaCreated() {
	antennasCache.delete();
	router.push('/my/antennas');
}

definePageMetadata(() => ({
	title: i18n.ts.createAntenna,
	icon: 'ti ti-antenna',
}));
</script>
