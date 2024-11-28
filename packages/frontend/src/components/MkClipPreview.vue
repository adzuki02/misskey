<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkA :to="`/clips/${clip.id}`" :class="$style.link">
	<div :class="$style.root" class="_panel _gaps_s">
		<b>{{ clip.name }}</b>
		<div :class="$style.description">
			<div v-if="clip.description"><Mfm :text="clip.description" :plain="true" :nowrap="true"/></div>
			<div v-if="clip.lastClippedAt">{{ i18n.ts.updatedAt }}: <MkTime :time="clip.lastClippedAt" mode="detail"/></div>
			<div v-if="clip.notesCount != null">{{ i18n.ts.notesCount }}: {{ number(clip.notesCount) }}</div>
		</div>
		<template v-if="!props.noUserInfo">
			<div :class="$style.divider"></div>
			<div>
				<MkAvatar :user="clip.user" :class="$style.userAvatar" link preview/> <MkUserName :user="clip.user" :nowrap="false"/>
			</div>
		</template>
	</div>
</MkA>
</template>

<script lang="ts" setup>
import type { Clip } from 'misskey-js/entities.js';
import { i18n } from '@/i18n.js';
import number from '@/filters/number.js';

const props = withDefaults(defineProps<{
	clip: Clip;
	noUserInfo?: boolean;
}>(), {
	noUserInfo: false,
});
</script>

<style lang="scss" module>
.link {
	display: block;

	&:focus-visible {
		outline: none;

		.root {
			box-shadow: inset 0 0 0 2px var(--MI_THEME-focus);
		}
	}

	&:hover {
		text-decoration: none;
		color: var(--MI_THEME-accent);
	}
}

.root {
	padding: 16px;
}

.divider {
	height: 1px;
	background: var(--MI_THEME-divider);
}

.description {
	font-size: 90%;
}

.userAvatar {
	width: 32px;
	height: 32px;
}
</style>
