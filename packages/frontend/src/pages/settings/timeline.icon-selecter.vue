<template>
<MkModalWindow ref="dialogEl" withOkButton @ok="ok" @close="dialogEl?.close()" @closed="$emit('closed')">
	<template #header>{{ i18n.ts.icon }}</template>

	<MkSpacer>
		<div :class="$style.icons">
			<button v-for="icon in icons" :key="icon.value" class="_button" :class="[$style.icon, { [$style.active]: icon.value === selected }]" @click="select(icon.value)">
				<i :class="icon.value"></i>
			</button>
		</div>
	</MkSpacer>
</MkModalWindow>
</template>

<script lang="ts" setup>
import { ref, useTemplateRef } from 'vue';
import MkModalWindow from '@/components/MkModalWindow.vue';
import { i18n } from '@/i18n';

const dialogEl = useTemplateRef('dialogEl');
const selected = ref<string>();

const icons = [
	{ value: 'ti ti-home' },
	{ value: 'ti ti-planet' },
	{ value: 'ti ti-universe' },
	{ value: 'ti ti-whirl' },
	{ value: 'ti ti-list' },
	{ value: 'ti ti-antenna' },
	{ value: 'ti ti-device-tv' },
	{ value: 'ti ti-star' },
	{ value: 'ti ti-user' },
	{ value: 'ti ti-users' },
	{ value: 'ti ti-heart' },
	{ value: 'ti ti-hearts' },
	{ value: 'ti ti-music' },
	{ value: 'ti ti-photo' },
	{ value: 'ti ti-palette' },
	{ value: 'ti ti-news' },
	{ value: 'ti ti-rss' },
	{ value: 'ti ti-device-gamepad' },
	{ value: 'ti ti-shopping-cart' },
	{ value: 'ti ti-robot' },
	{ value: 'ti ti-speakerphone' },
	{ value: 'ti ti-bell' },
	{ value: 'ti ti-bell-off' },
	{ value: 'ti ti-info-circle' },
];

const emit = defineEmits<{
	(ev: 'done', v: string): void;
	(ev: 'closed'): void;
}>();

function select(value: string) {
	selected.value = value;
}

function ok() {
	if (selected.value) {
		emit('done', selected.value);
	}
	dialogEl.value?.close();
}
</script>

<style lang="scss" module>
.icons {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
}

.icon {
	flex-shrink: 0;
	width: 64px;
	height: 64px;
	border: solid 1px var(--MI_THEME-divider);
	text-align: center;
	cursor: pointer;

	&:hover {
		opacity: .7;
	}

	&.active {
		border-color: var(--MI_THEME-accent);

		> i {
			color: var(--MI_THEME-accent)
		}
	}

	> i {
		/* 実際のアイコンは128%拡大される */
		font-size: 32px;
		line-height: 64px;
	}
}
</style>
