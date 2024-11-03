<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkSpacer :contentMax="1200">
	<MkFoldableSection class="_margin" persistKey="explore-pinned-users">
		<template #header><i class="ti ti-bookmark ti-fw" style="margin-right: 0.5em;"></i>{{ i18n.ts.pinnedUsers }}</template>
		<MkUserList :pagination="pinnedUsers"/>
	</MkFoldableSection>

	<MkFoldableSection :foldable="true" :expanded="false" class="_margin">
		<template #header><i class="ti ti-hash ti-fw" style="margin-right: 0.5em;"></i>{{ i18n.ts.popularTags }}</template>

		<div>
			<MkA v-for="tagsListItem in tagsList" :key="tagsListItem.tag" :to="`/user-tags/${tagsListItem.tag}`" style="margin-right: 16px;">{{ tagsListItem.tag }}</MkA>
		</div>
	</MkFoldableSection>
</MkSpacer>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import * as Misskey from 'misskey-js';
import MkUserList from '@/components/MkUserList.vue';
import MkFoldableSection from '@/components/MkFoldableSection.vue';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { i18n } from '@/i18n.js';

const tagsList = ref<Misskey.entities.Hashtag[]>([]);

const pinnedUsers = { endpoint: 'pinned-users' as const, noPaging: true, limit: 10 };

misskeyApi('hashtags/list', {
	sort: '+attachedUsers',
	limit: 30,
}).then(tags => {
	tagsList.value = tags;
});
</script>
