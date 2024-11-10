/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkSpacer',
	component: MkSpacer,
} satisfies Meta<typeof MkSpacer>;

export default meta;

import MkSpacer from './MkSpacer.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkSpacer,
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
			template: '<MkSpacer v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkSpacer>;
