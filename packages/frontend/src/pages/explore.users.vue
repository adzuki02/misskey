<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkSpacer :contentMax="1200">
	<template v-if="tag == null">
		<MkFoldableSection class="_margin" persistKey="explore-pinned-users">
			<template #header><i class="ti ti-bookmark ti-fw" style="margin-right: 0.5em;"></i>{{ i18n.ts.pinnedUsers }}</template>
			<MkUserList :pagination="pinnedUsers"/>
		</MkFoldableSection>
	</template>

	<MkFoldableSection ref="tagsEl" :foldable="true" :expanded="false" class="_margin">
		<template #header><i class="ti ti-hash ti-fw" style="margin-right: 0.5em;"></i>{{ i18n.ts.popularTags }}</template>

		<div>
			<MkA v-for="tagsListItem in tagsList" :key="tagsListItem.tag" :to="`/user-tags/${tagsListItem.tag}`" style="margin-right: 16px;">{{ tagsListItem.tag }}</MkA>
		</div>
	</MkFoldableSection>

	<MkFoldableSection v-if="tag != null" :key="`${tag}`" class="_margin">
		<template #header><i class="ti ti-hash ti-fw" style="margin-right: 0.5em;"></i>{{ tag }}</template>
		<MkUserList :pagination="tagUsers"/>
	</MkFoldableSection>
</MkSpacer>
</template>

<script lang="ts" setup>
import { watch, ref, shallowRef, computed } from 'vue';
import * as Misskey from 'misskey-js';
import type { Paging } from '@/components/MkPagination.vue';
import MkUserList from '@/components/MkUserList.vue';
import MkFoldableSection from '@/components/MkFoldableSection.vue';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { i18n } from '@/i18n.js';

const props = defineProps<{
	tag?: string;
}>();

const tagsEl = shallowRef<InstanceType<typeof MkFoldableSection>>();
const tagsList = ref<Misskey.entities.Hashtag[]>([]);

watch(() => props.tag, () => {
	if (tagsEl.value) tagsEl.value.toggleContent(props.tag == null);
});

const tagUsers = computed(() => ({
	endpoint: 'hashtags/users' as const,
	limit: 30,
	params: {
		tag: props.tag,
		origin: 'combined',
		sort: '+follower',
	},
} as Paging<'hashtags/users'>));

const pinnedUsers: Paging<'pinned-users'> = { endpoint: 'pinned-users', noPaging: true, limit: 10 };

misskeyApi('hashtags/list', {
	sort: '+attachedUsers',
	limit: 30,
}).then(tags => {
	tagsList.value = tags;
});
</script>
