<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<component :is="link ? MkA : 'span'" v-user-preview="preview ? user.id : undefined" v-bind="bound" class="_noSelect" :class="[$style.root, { [$style.square]: squareAvatars }]" :style="{ color }" :title="acct(user)" @click="onClick">
	<MkImgWithBlurhash :class="$style.inner" :src="url" :hash="user.avatarBlurhash" :cover="true" :onlyAvgColor="true"/>
	<img v-if="instanceIcon && instanceIconUrl" :class="$style.instanceIcon" :src="instanceIconUrl" :style="instanceIconBg"/>
</component>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue';
import MkImgWithBlurhash from '../MkImgWithBlurhash.vue';
import MkA from './MkA.vue';
import type { UserLite } from 'misskey-js/entities.js';
import { getStaticImageUrl, getProxiedImageUrlNullable } from '@/scripts/media-proxy.js';
import { extractAvgColorFromBlurhash } from '@/scripts/extract-avg-color-from-blurhash.js';
import { acct, userPage } from '@/filters/user.js';
import { defaultStore } from '@/store.js';
import { instance as Instance } from '@/instance.js';

const squareAvatars = ref(defaultStore.state.squareAvatars);

const props = withDefaults(defineProps<{
	user: UserLite;
	target?: string | null;
	link?: boolean;
	preview?: boolean;
	instanceIcon?: boolean;
}>(), {
	target: null,
	link: false,
	preview: false,
	instanceIcon: false,
});

const emit = defineEmits<{
	(ev: 'click', v: MouseEvent): void;
}>();

const bound = computed(() => props.link
	? { to: userPage(props.user), target: props.target }
	: {});

const url = computed(() => {
	if (props.user.avatarUrl == null) return null;
	if (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.avatar) return getStaticImageUrl(props.user.avatarUrl);
	return props.user.avatarUrl;
});

function onClick(ev: MouseEvent): void {
	if (props.link) return;
	emit('click', ev);
}

const color = ref<string | undefined>();

watch(() => props.user.avatarBlurhash, () => {
	if (props.user.avatarBlurhash == null) return;
	color.value = extractAvgColorFromBlurhash(props.user.avatarBlurhash);
}, {
	immediate: true,
});

// if no instance data is given, this is for the local instance
const instance = props.user.instance ?? {
	themeColor: (document.querySelector('meta[name="theme-color-orig"]') as HTMLMetaElement | undefined)?.content,
};

const instanceIconUrl = computed(() => props.user.instance ? getProxiedImageUrlNullable(props.user.instance.faviconUrl, 'preview') : getProxiedImageUrlNullable(Instance.iconUrl, 'preview') ?? '/favicon.ico');

const instanceThemeColor = instance.themeColor ?? '#777777';

const instanceIconBg = {
	background: instanceThemeColor,
};
</script>

<style lang="scss" module>
@keyframes earwiggleleft {
	from { transform: rotate(37.6deg) skew(30deg); }
	25% { transform: rotate(10deg) skew(30deg); }
	50% { transform: rotate(20deg) skew(30deg); }
	75% { transform: rotate(0deg) skew(30deg); }
	to { transform: rotate(37.6deg) skew(30deg); }
}

@keyframes earwiggleright {
	from { transform: rotate(-37.6deg) skew(-30deg); }
	30% { transform: rotate(-10deg) skew(-30deg); }
	55% { transform: rotate(-20deg) skew(-30deg); }
	75% { transform: rotate(0deg) skew(-30deg); }
	to { transform: rotate(-37.6deg) skew(-30deg); }
}

@keyframes eartightleft {
	from { transform: rotate(37.6deg) skew(30deg); }
	50% { transform: rotate(37.4deg) skew(30deg); }
	to { transform: rotate(37.6deg) skew(30deg); }
}

@keyframes eartightright {
	from { transform: rotate(-37.6deg) skew(-30deg); }
	50% { transform: rotate(-37.4deg) skew(-30deg); }
	to { transform: rotate(-37.6deg) skew(-30deg); }
}

.root {
	position: relative;
	display: inline-block;
	vertical-align: bottom;
	flex-shrink: 0;
	border-radius: 100%;
	line-height: 16px;
}

.inner {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	top: 0;
	border-radius: 100%;
	z-index: 1;
	overflow: clip;
	object-fit: cover;
	width: 100%;
	height: 100%;
}

.instanceIcon {
	position: absolute;
	z-index: 2;
	bottom: -3px;
	left: -3px;
	width: 30%;
	height: 30%;
	box-shadow: 0 0 0 2px var(--panel);
	border-radius: 120%;
}

.square {
	border-radius: 20%;

	> .inner {
		border-radius: 20%;
	}
}
</style>
