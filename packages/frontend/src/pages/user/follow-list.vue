<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div>
	<MkPagination v-slot="{items}" ref="list" :pagination="type === 'following' ? followingPagination : followersPagination">
		<div :class="$style.users">
			<MkUserInfo v-for="otherParty in items.map(x => type === 'following' ? x.followee : x.follower).filter(x => x !== undefined)" :key="otherParty.id" :user="otherParty"/>
		</div>
	</MkPagination>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { User } from 'misskey-js/entities.js';
import MkUserInfo from '@/components/MkUserInfo.vue';
import MkPagination from '@/components/MkPagination.vue';

const props = defineProps<{
	user: User;
	type: 'following' | 'followers';
}>();

const followingPagination = {
	endpoint: 'users/following' as const,
	limit: 20,
	params: computed(() => ({
		userId: props.user.id,
	})),
};

const followersPagination = {
	endpoint: 'users/followers' as const,
	limit: 20,
	params: computed(() => ({
		userId: props.user.id,
	})),
};
</script>

<style lang="scss" module>
.users {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
	grid-gap: var(--MI-margin);
}
</style>
