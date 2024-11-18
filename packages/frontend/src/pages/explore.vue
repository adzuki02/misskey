<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :tabs="headerTabs"/></template>
	<div v-if="tab === 'users'" key="users">
		<XUsers/>
	</div>
	<div v-else-if="tab === 'roles' && $i" key="roles">
		<XRoles/>
	</div>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import XUsers from './explore.users.vue';
import XRoles from './explore.roles.vue';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { i18n } from '@/i18n.js';
import { $i } from '@/account.js';

const props = withDefaults(defineProps<{
	initialTab?: 'users' | 'roles';
}>(), {
	initialTab: 'users',
});

const tab = ref(props.initialTab);

const headerTabs = computed(() => [
	{
		key: 'users',
		icon: 'ti ti-users',
		title: i18n.ts.users,
	},
	$i
		? {
			key: 'roles',
			icon: 'ti ti-badges',
			title: i18n.ts.roles,
		}
		: undefined,
]);

definePageMetadata(() => ({
	title: i18n.ts.explore,
	icon: 'ti ti-hash',
}));
</script>
