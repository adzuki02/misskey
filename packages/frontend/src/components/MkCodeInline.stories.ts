/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/MkCodeInline',
	component: MkCodeInline,
} satisfies Meta<typeof MkCodeInline>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
import { StoryObj } from '@storybook/vue3';
import MkCodeInline from './MkCodeInline.vue';
export const Default = {
	render(args) {
		return {
			components: {
				MkCodeInline,
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
			template: '<MkCodeInline v-bind="props"/>',
		};
	},
	args: {
		code: '<: "Hello, world!"',
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkCodeInline>;
