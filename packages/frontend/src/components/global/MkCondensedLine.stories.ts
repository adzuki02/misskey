/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/global/MkCondensedLine',
	component: MkCondensedLine,
} satisfies Meta<typeof MkCondensedLine>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StoryObj } from '@storybook/vue3';
import MkCondensedLine from './MkCondensedLine.vue';
export const Default = {
	render(args) {
		return {
			components: {
				MkCondensedLine,
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
			template: '<MkCondensedLine>{{ props.text }}</MkCondensedLine>',
		};
	},
	args: {
		// @ts-expect-error text is for test
		text: 'This is a condensed line.',
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkCondensedLine>;
export const ContainerIs100px = {
	...Default,
	decorators: [
		() => ({
			template: '<div style="width: 100px;"><story/></div>',
		}),
	],
	// @ts-expect-error text is for test
} satisfies StoryObj<typeof MkCondensedLine>;
