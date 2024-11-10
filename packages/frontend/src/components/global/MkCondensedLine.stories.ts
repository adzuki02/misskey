/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkCondensedLine',
	component: MkCondensedLine,
} satisfies Meta<typeof MkCondensedLine>;

export default meta;

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
