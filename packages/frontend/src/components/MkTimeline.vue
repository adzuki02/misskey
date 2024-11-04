<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkPullToRefresh ref="prComponent" :refresher="() => reloadTimeline()">
	<MkNotes
		v-if="paginationQuery"
		ref="tlComponent"
		:pagination="paginationQuery"
		:noGap="!defaultStore.state.showGapBetweenNotesInTimeline"
		@queue="emit('queue', $event)"
		@status="prComponent?.setDisabled($event)"
	/>
</MkPullToRefresh>
</template>

<script lang="ts" setup>
import { computed, watch, onUnmounted, provide, shallowRef, useTemplateRef } from 'vue';
import type { ChannelConnection, Channels, Endpoints as MisskeyEndpoints } from 'misskey-js';
import type { BasicTimelineType } from '@/timelines.js';
import MkNotes from '@/components/MkNotes.vue';
import MkPullToRefresh from '@/components/MkPullToRefresh.vue';
import { useStream } from '@/stream.js';
import * as sound from '@/scripts/sound.js';
import { $i } from '@/account.js';
import { defaultStore } from '@/store.js';
import { Paging } from '@/components/MkPagination.vue';

const props = withDefaults(defineProps<{
	src: BasicTimelineType | 'mentions' | 'directs' | 'list' | 'antenna' | 'channel' | 'role';
	list?: string;
	antenna?: string;
	channel?: string;
	role?: string;
	sound?: boolean;
	withRenotes?: boolean;
	withReplies?: boolean;
	onlyFiles?: boolean;
}>(), {
	withRenotes: true,
	withReplies: false,
	onlyFiles: false,
});

const emit = defineEmits<{
	(ev: 'note'): void;
	(ev: 'queue', count: number): void;
}>();

provide('inTimeline', true);
provide('inChannel', computed(() => props.src === 'channel'));

type TimelineQueryType = {
  antennaId?: string,
  withRenotes?: boolean,
  withReplies?: boolean,
  withFiles?: boolean,
  visibility?: string,
  listId?: string,
  channelId?: string,
  roleId?: string
}

const prComponent = useTemplateRef('prComponent');
const tlComponent = useTemplateRef('tlComponent');

function prepend(note) {
	if (tlComponent.value == null) return;

	tlComponent.value.pagingComponent?.prepend(note);

	emit('note');

	if (props.sound) {
		sound.playMisskeySfx($i && (note.userId === $i.id) ? 'noteMy' : 'note');
	}
}

let connection: ChannelConnection | null = null;
let connection2: ChannelConnection | null = null;
let paginationQuery: Paging | null = null;

const stream = useStream();

function connectChannel() {
	if (props.src === 'antenna') {
		if (props.antenna == null) return;
		(connection as ChannelConnection<Channels['antenna']>) = stream.useChannel('antenna', {
			antennaId: props.antenna,
		});
	} else if (props.src === 'home') {
		(connection as ChannelConnection<Channels['homeTimeline']>) = stream.useChannel('homeTimeline', {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
		});
		(connection2 as ChannelConnection<Channels['main']>) = stream.useChannel('main');
	} else if (props.src === 'global') {
		(connection as ChannelConnection<Channels['globalTimeline']>) = stream.useChannel('globalTimeline', {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
		});
	} else if (props.src === 'mentions') {
		(connection as ChannelConnection<Channels['main']>) = stream.useChannel('main');
		(connection as ChannelConnection<Channels['main']>).on('mention', prepend);
	} else if (props.src === 'directs') {
		const onNote = note => {
			if (note.visibility === 'specified') {
				prepend(note);
			}
		};
		(connection as ChannelConnection<Channels['main']>) = stream.useChannel('main');
		(connection as ChannelConnection<Channels['main']>).on('mention', onNote);
	} else if (props.src === 'list') {
		if (props.list == null) return;
		(connection as ChannelConnection<Channels['userList']>) = stream.useChannel('userList', {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
			listId: props.list,
		});
	} else if (props.src === 'channel') {
		if (props.channel == null) return;
		(connection as ChannelConnection<Channels['channel']>) = stream.useChannel('channel', {
			channelId: props.channel,
		});
	} else if (props.src === 'role') {
		if (props.role == null) return;
		(connection as ChannelConnection<Channels['roleTimeline']>) = stream.useChannel('roleTimeline', {
			roleId: props.role,
		});
	}
	if (props.src !== 'directs' && props.src !== 'mentions') connection?.on('note', prepend);
}

function disconnectChannel() {
	if (connection) connection.dispose();
	if (connection2) connection2.dispose();
}

function updatePaginationQuery() {
	let endpoint: keyof MisskeyEndpoints | null;
	let query: TimelineQueryType | null;

	if (props.src === 'antenna') {
		endpoint = 'antennas/notes';
		query = {
			antennaId: props.antenna,
		};
	} else if (props.src === 'home') {
		endpoint = 'notes/timeline';
		query = {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
		};
	} else if (props.src === 'global') {
		endpoint = 'notes/global-timeline';
		query = {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
		};
	} else if (props.src === 'mentions') {
		endpoint = 'notes/mentions';
		query = null;
	} else if (props.src === 'directs') {
		endpoint = 'notes/mentions';
		query = {
			visibility: 'specified',
		};
	} else if (props.src === 'list') {
		endpoint = 'notes/user-list-timeline';
		query = {
			withRenotes: props.withRenotes,
			withFiles: props.onlyFiles ? true : undefined,
			listId: props.list,
		};
	} else if (props.src === 'channel') {
		endpoint = 'channels/timeline';
		query = {
			channelId: props.channel,
		};
	} else if (props.src === 'role') {
		endpoint = 'roles/notes';
		query = {
			roleId: props.role,
		};
	} else {
		endpoint = null;
		query = null;
	}

	if (endpoint && query) {
		paginationQuery = {
			endpoint: endpoint,
			limit: 10,
			params: query,
		};
	} else {
		paginationQuery = null;
	}
}

function refreshEndpointAndChannel() {
	if (!defaultStore.state.disableStreamingTimeline) {
		disconnectChannel();
		connectChannel();
	}

	updatePaginationQuery();
}

// デッキのリストカラムでwithRenotesを変更した場合に自動的に更新されるようにさせる
// IDが切り替わったら切り替え先のTLを表示させたい
watch(() => [props.list, props.antenna, props.channel, props.role, props.withRenotes], refreshEndpointAndChannel);

// 初回表示用
refreshEndpointAndChannel();

onUnmounted(() => {
	disconnectChannel();
});

function reloadTimeline() {
	return new Promise<void>((res) => {
		if (tlComponent.value == null) return;

		tlComponent.value.pagingComponent?.reload().then(() => {
			res();
		});
	});
}

defineExpose({
	reloadTimeline,
});
</script>
