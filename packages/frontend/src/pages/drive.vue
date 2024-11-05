<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div>
	<XDrive ref="drive" @cd="x => folder = x"/>
</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { DriveFolder } from 'misskey-js/entities.js';
import XDrive from '@/components/MkDrive.vue';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';

const folder = ref<DriveFolder | null>(null);

definePageMetadata(() => ({
	title: folder.value ? folder.value.name : i18n.ts.drive,
	icon: 'ti ti-cloud',
	hideHeader: true,
}));
</script>
