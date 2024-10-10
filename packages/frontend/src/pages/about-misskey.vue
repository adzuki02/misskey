<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<MkStickyContainer>
	<template #header><MkPageHeader/></template>
	<div style="overflow: clip;">
		<MkSpacer :contentMax="600" :marginMin="20">
			<div class="_gaps_m znqjceqz">
				<div v-panel class="about">
					<div class="container">
						<img src="/client-assets/about-icon.png" alt="" class="icon" draggable="false"/>
						<div class="misskey">Misskey</div>
						<div class="version">v{{ version }}</div>
					</div>
				</div>
				<div style="text-align: center;">
					{{ i18n.tsx.poweredByMisskeyDescription({ name: instance.name ?? host }).replace(/<\/?b>/g, '') }}
				</div>
				<FormSection v-if="instance.repositoryUrl !== 'https://github.com/misskey-dev/misskey'">
					<div class="_gaps_s">
						<MkInfo>
							{{ i18n.tsx._aboutMisskey.thisIsModifiedVersion({ name: instance.name ?? host }) }}
						</MkInfo>
						<FormLink v-if="instance.repositoryUrl" :to="instance.repositoryUrl" external>
							<template #icon><i class="ti ti-code"></i></template>
							{{ i18n.ts._aboutMisskey.source }}
						</FormLink>
						<FormLink v-if="instance.providesTarball" :to="`/tarball/misskey-${version}.tar.gz`" external>
							<template #icon><i class="ti ti-download"></i></template>
							{{ i18n.ts._aboutMisskey.source }}
							<template #suffix>Tarball</template>
						</FormLink>
						<MkInfo v-if="!instance.repositoryUrl && !instance.providesTarball" warn>
							{{ i18n.ts.sourceCodeIsNotYetProvided }}
						</MkInfo>
					</div>
				</FormSection>
			</div>
		</MkSpacer>
	</div>
</MkStickyContainer>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { host, version } from '@/config.js';
import FormLink from '@/components/form/link.vue';
import FormSection from '@/components/form/section.vue';
import MkInfo from '@/components/MkInfo.vue';
import { i18n } from '@/i18n.js';
import { instance } from '@/instance.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';

definePageMetadata(() => ({
	title: i18n.ts.aboutMisskey,
	icon: null,
}));
</script>

<style lang="scss" scoped>
.znqjceqz {
	> .about {
		position: relative;
		border-radius: var(--MI-radius);

		> .container {
			position: relative;
			text-align: center;
			padding: 16px;

			> .icon {
				display: block;
				width: 80px;
				margin: 0 auto;
				border-radius: 16px;
				position: relative;
				z-index: 1;
			}

			> .misskey {
				margin: 0.75em auto 0 auto;
				width: max-content;
				position: relative;
				z-index: 1;
			}

			> .version {
				margin: 0 auto;
				width: max-content;
				opacity: 0.5;
				position: relative;
				z-index: 1;
			}
		}
	}
}
</style>
