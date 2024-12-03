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
	{ name: i18n.ts._timelines.home, value: 'ti ti-home' },
	{ name: i18n.ts._timelines.local, value: 'ti ti-planet' },
	{ name: i18n.ts._timelines.social, value: 'ti ti-universe' },
	{ name: i18n.ts._timelines.global, value: 'ti ti-whirl' },
	{ name: i18n.ts.lists, value: 'ti ti-list' },
	{ name: i18n.ts.antennas, value: 'ti ti-antenna' },
	{ name: i18n.ts.channel, value: 'ti ti-device-tv' },
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
		font-size: 48px;
		line-height: 64px;
	}
}
</style>
