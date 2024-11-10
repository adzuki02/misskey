/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/vue3-vite';
import { type Plugin, PluginOption, mergeConfig } from 'vite';

const _dirname = fileURLToPath(new URL('.', import.meta.url));

const config: StorybookConfig = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	staticDirs: [{ from: '../assets', to: '/client-assets' }],
	addons: [
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-links',
		'@storybook/addon-storysource',
		resolve(_dirname, '../node_modules/storybook-addon-misskey-theme'),
	],
	framework: '@storybook/vue3-vite',
	docs: {
		autodocs: 'tag',
	},
	core: {
		disableTelemetry: true,
	},
	async viteFinal(config) {
		const replacePluginForIsChromatic = config.plugins?.findIndex((plugin: PluginOption) => plugin && !Array.isArray(plugin) && !(plugin instanceof Promise) && plugin.name === 'replace') ?? -1;

		if (replacePluginForIsChromatic !== -1) {
			config.plugins?.splice(replacePluginForIsChromatic, 1);
		}

		return mergeConfig(config, {
			build: {
				target: [
					'chrome108',
					'firefox109',
					'safari16',
				],
			},
		});
	},
};

export default config;
