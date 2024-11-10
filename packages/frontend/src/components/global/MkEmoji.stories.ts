/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/global/MkEmoji',
	component: MkEmoji,
} satisfies Meta<typeof MkEmoji>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StoryObj } from '@storybook/vue3';
import MkEmoji from './MkEmoji.vue';
export const Default = {
	render(args) {
		return {
			components: {
				MkEmoji,
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
			template: '<MkEmoji v-bind="props" />',
		};
	},
	args: {
		emoji: '❤',
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkEmoji>;
