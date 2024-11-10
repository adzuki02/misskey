/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkFooterSpacer',
	component: MkFooterSpacer,
} satisfies Meta<typeof MkFooterSpacer>;

export default meta;

import MkFooterSpacer from './MkFooterSpacer.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkFooterSpacer,
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
			template: '<MkFooterSpacer v-bind="props" />',
		};
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkFooterSpacer>;
