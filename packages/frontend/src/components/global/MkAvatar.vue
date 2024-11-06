<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<component :is="link ? MkA : 'span'" v-user-preview="preview ? user.id : undefined" v-bind="bound" class="_noSelect" :class="[$style.root, { [$style.animation]: animation, [$style.square]: squareAvatars }]" :style="{ color }" :title="acct(user)" @click="onClick">
	<MkImgWithBlurhash :class="$style.inner" :src="url" :hash="user.avatarBlurhash" :cover="true" :onlyAvgColor="true"/>
	<template v-if="showDecoration">
		<img
			v-for="decoration in decorations ?? user.avatarDecorations"
			:class="[$style.decoration]"
			:src="getDecorationUrl(decoration)"
			:style="{
				rotate: getDecorationAngle(decoration),
				scale: getDecorationScale(decoration),
				translate: getDecorationOffset(decoration),
			}"
			alt=""
		>
	</template>
</component>
</template>

<script lang="ts" setup>
import { watch, ref, computed } from 'vue';
import MkImgWithBlurhash from '../MkImgWithBlurhash.vue';
import MkA from './MkA.vue';
import type { UserLite, UserDetailed } from 'misskey-js/entities.js';
import { getStaticImageUrl } from '@/scripts/media-proxy.js';
import { extractAvgColorFromBlurhash } from '@/scripts/extract-avg-color-from-blurhash.js';
import { acct, userPage } from '@/filters/user.js';
import { defaultStore } from '@/store.js';

const animation = ref(defaultStore.state.animation);
const squareAvatars = ref(defaultStore.state.squareAvatars);

const props = withDefaults(defineProps<{
	user: UserLite;
	target?: string | null;
	link?: boolean;
	preview?: boolean;
	decorations?: Omit<UserDetailed['avatarDecorations'][number], 'id'>[];
	forceShowDecoration?: boolean;
}>(), {
	target: null,
	link: false,
	preview: false,
	decorations: undefined,
	forceShowDecoration: false,
});

const emit = defineEmits<{
	(ev: 'click', v: MouseEvent): void;
}>();

const showDecoration = props.forceShowDecoration || defaultStore.state.showAvatarDecorations;

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

function getDecorationUrl(decoration: Omit<UserDetailed['avatarDecorations'][number], 'id'>) {
	if (defaultStore.state.disableShowingAnimatedImages || defaultStore.state.dataSaver.avatar) return getStaticImageUrl(decoration.url);
	return decoration.url;
}

function getDecorationAngle(decoration: Omit<UserDetailed['avatarDecorations'][number], 'id'>) {
	const angle = decoration.angle ?? 0;
	return angle === 0 ? undefined : `${angle * 360}deg`;
}

function getDecorationScale(decoration: Omit<UserDetailed['avatarDecorations'][number], 'id'>) {
	const scaleX = decoration.flipH ? -1 : 1;
	return scaleX === 1 ? undefined : `${scaleX} 1`;
}

function getDecorationOffset(decoration: Omit<UserDetailed['avatarDecorations'][number], 'id'>) {
	const offsetX = decoration.offsetX ?? 0;
	const offsetY = decoration.offsetY ?? 0;
	return offsetX === 0 && offsetY === 0 ? undefined : `${offsetX * 100}% ${offsetY * 100}%`;
}

const color = ref<string | undefined>();

watch(() => props.user.avatarBlurhash, () => {
	if (props.user.avatarBlurhash == null) return;
	color.value = extractAvgColorFromBlurhash(props.user.avatarBlurhash);
}, {
	immediate: true,
});
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

.indicator {
	position: absolute;
	z-index: 2;
	bottom: 0;
	left: 0;
	width: 20%;
	height: 20%;
}

.square {
	border-radius: 20%;

	> .inner {
		border-radius: 20%;
	}
}

.decoration {
	position: absolute;
	z-index: 1;
	top: -50%;
	left: -50%;
	width: 200%;
	pointer-events: none;
}
</style>
