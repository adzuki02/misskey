<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader v-model:tab="tab" :tabs="headerTabs"/></template>
	<div>
		<div v-if="user">
			<XHome v-if="tab === 'home'" key="home" :user="user"/>
			<MkSpacer v-else-if="tab === 'notes'" key="notes" :contentMax="800" style="padding-top: 0">
				<XTimeline :user="user"/>
			</MkSpacer>
			<XReactions v-else-if="tab === 'reactions' && (iAmModerator || $i?.id === user.id || user.publicReactions)" key="reactions" :user="user"/>
			<XClips v-else-if="tab === 'clips' && user.host === null" key="clips" :user="user"/>
			<XLists v-else-if="tab === 'lists' && user.host === null" key="lists" :user="user"/>
			<XFlashs v-else-if="tab === 'flashs' && user.host === null" key="flashs" :user="user"/>
			<XRaw v-else-if="tab === 'raw'" key="raw" :user="user"/>
		</div>
		<MkError v-else-if="error" @retry="fetchUser()"/>
		<MkLoading v-else/>
	</div>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed, watch, ref } from 'vue';
import { parse as parseAcct } from 'misskey-js/acct.js';
import type { UserDetailed } from 'misskey-js/entities.js';
import { acct as getAcct } from '@/filters/user.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { i18n } from '@/i18n.js';
import { $i, iAmModerator } from '@/account.js';

const XHome = defineAsyncComponent(() => import('./home.vue'));
const XTimeline = defineAsyncComponent(() => import('./index.timeline.vue'));
const XReactions = defineAsyncComponent(() => import('./reactions.vue'));
const XClips = defineAsyncComponent(() => import('./clips.vue'));
const XLists = defineAsyncComponent(() => import('./lists.vue'));
const XFlashs = defineAsyncComponent(() => import('./flashs.vue'));
const XRaw = defineAsyncComponent(() => import('./raw.vue'));

const props = withDefaults(defineProps<{
	acct: string;
	page?: string;
}>(), {
	page: 'home',
});

const tab = ref(props.page);

const user = ref<UserDetailed>();
const error = ref<any>(null);

function fetchUser(): void {
	user.value = undefined;
	misskeyApi('users/show', parseAcct(props.acct)).then(u => {
		user.value = u;
	}).catch(err => {
		error.value = err;
	});
}

watch(() => props.acct, fetchUser, {
	immediate: true,
});

const headerTabs = computed(() => user.value ? [{
	key: 'home',
	title: i18n.ts.overview,
	icon: 'ti ti-home',
}, {
	key: 'notes',
	title: i18n.ts.notes,
	icon: 'ti ti-pencil',
}, ...($i && ($i.id === user.value.id || $i.isAdmin || $i.isModerator)) || user.value.publicReactions ? [{
	key: 'reactions',
	title: i18n.ts.reaction,
	icon: 'ti ti-mood-happy',
}] : [], ...(user.value.host == null ? [{
	key: 'clips',
	title: i18n.ts.clips,
	icon: 'ti ti-paperclip',
}] : []), ...(user.value.host == null ? [{
	key: 'lists',
	title: i18n.ts.lists,
	icon: 'ti ti-list',
}] : []), ...(user.value.host == null ? [{
	key: 'flashs',
	title: 'Play',
	icon: 'ti ti-player-play',
}] : []), {
	key: 'raw',
	title: 'Raw',
	icon: 'ti ti-code',
}] : []);

definePageMetadata(() => ({
	title: i18n.ts.user,
	icon: 'ti ti-user',
	...user.value ? {
		title: user.value.name ? `${user.value.name} (@${user.value.username})` : `@${user.value.username}`,
		subtitle: `@${getAcct(user.value)}`,
		userName: user.value,
		avatar: user.value,
		path: `/@${user.value.username}`,
		share: {
			title: user.value.name,
		},
	} : {},
}));
</script>
