/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/global/MkLoading',
	component: MkLoading,
} satisfies Meta<typeof MkLoading>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StoryObj } from '@storybook/vue3';
import isChromatic from 'chromatic/isChromatic';
import MkLoading from './MkLoading.vue';
export const Default = {
	render(args) {
		return {
			components: {
				MkLoading,
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
			template: '<MkLoading v-bind="props" />',
		};
	},
	args: {
		static: isChromatic(),
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkLoading>;
export const Inline = {
	...Default,
	args: {
		...Default.args,
		inline: true,
	},
} satisfies StoryObj<typeof MkLoading>;
export const Colored = {
	...Default,
	args: {
		...Default.args,
		colored: true,
	},
} satisfies StoryObj<typeof MkLoading>;
export const Mini = {
	...Default,
	args: {
		...Default.args,
		mini: true,
	},
} satisfies StoryObj<typeof MkLoading>;
export const Em = {
	...Default,
	args: {
		...Default.args,
		em: true,
	},
} satisfies StoryObj<typeof MkLoading>;
