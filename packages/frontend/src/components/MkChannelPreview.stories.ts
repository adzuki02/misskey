/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkChannelPreview',
	component: MkChannelPreview,
} satisfies Meta<typeof MkChannelPreview>;

export default meta;

import MkChannelPreview from './MkChannelPreview.vue';
import { channel } from '@/../.storybook/fakes.js';

export const Default = {
	render(args) {
		return {
			components: {
				MkChannelPreview,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkChannelPreview v-bind="props" />',
		};
	},
	args: {
		channel: channel(),
	},
	parameters: {
		layout: 'fullscreen',
	},
	decorators: [
		() => ({
			template:
				'<div style="display: flex; align-items: center; justify-content: center; height: 100vh"><div style="max-width: 700px; width: 100%; margin: 3rem"><story/></div></div>',
		}),
	],
} satisfies StoryObj<typeof MkChannelPreview>;
