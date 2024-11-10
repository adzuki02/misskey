/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkAnimBg',
	component: MkAnimBg,
} satisfies Meta<typeof MkAnimBg>;

export default meta;

import MkAnimBg from './MkAnimBg.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkAnimBg,
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
			template: '<MkAnimBg v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkAnimBg>;
