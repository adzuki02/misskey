/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkLazy',
	component: MkLazy,
} satisfies Meta<typeof MkLazy>;

export default meta;

import MkLazy from './MkLazy.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkLazy,
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
			template: '<MkLazy v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkLazy>;
