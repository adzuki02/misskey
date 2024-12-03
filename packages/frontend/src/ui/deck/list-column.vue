<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<XColumn :menu="menu" :column="column" :isStacked="isStacked" :refresher="async () => { await timeline?.reloadTimeline() }">
	<template #header>
		<i class="ti ti-list"></i><span style="margin-left: 8px;">{{ column.name }}</span>
	</template>

	<MkTimeline v-if="column.listId" ref="timeline" src="list" :list="column.listId" :withRenotes="withRenotes"/>
</XColumn>
</template>

<script lang="ts" setup>
import { watch, shallowRef, ref } from 'vue';
import type { entities as MisskeyEntities } from 'misskey-js';
import XColumn from './column.vue';
import { updateColumn, Column } from './deck-store.js';
import MkTimeline from '@/components/MkTimeline.vue';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { i18n } from '@/i18n.js';
import { MenuItem } from '@/types/menu.js';
import { userListsCache } from '@/cache.js';

const props = defineProps<{
	column: Column;
	isStacked: boolean;
}>();

const timeline = shallowRef<InstanceType<typeof MkTimeline>>();
const withRenotes = ref(props.column.withRenotes ?? true);

if (props.column.listId == null) {
	setList();
}

watch(withRenotes, v => {
	updateColumn(props.column.id, {
		withRenotes: v,
	});
});

async function setList() {
	const lists = await misskeyApi('users/lists/list');
	const { canceled, result: list } = await os.select<MisskeyEntities.UserList | '_CREATE_'>({
		title: i18n.ts.selectList,
		items: [
			{ value: '_CREATE_', text: i18n.ts.createNew },
			(lists.length > 0 ? {
				sectionTitle: i18n.ts.createdLists,
				items: lists.map(x => ({
					value: x, text: x.name,
				})),
			} : undefined),
		],
		default: props.column.listId,
	});
	if (canceled) return;

	if (list === '_CREATE_') {
		const { canceled, result: name } = await os.inputText({
			title: i18n.ts.enterListName,
		});
		if (canceled || name === '') return;

		const res = await os.apiWithDialog('users/lists/create', { name: name });
		userListsCache.delete();

		updateColumn(props.column.id, {
			listId: res.id,
		});
	} else {
		updateColumn(props.column.id, {
			listId: list.id,
		});
	}
}

function editList() {
	os.pageWindow('my/lists/' + props.column.listId);
}

const menu: MenuItem[] = [
	{
		icon: 'ti ti-pencil',
		text: i18n.ts.selectList,
		action: setList,
	},
	{
		icon: 'ti ti-settings',
		text: i18n.ts.editList,
		action: editList,
	},
	{
		type: 'switch',
		text: i18n.ts.showRenotes,
		ref: withRenotes,
	},
];
</script>
