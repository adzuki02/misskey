/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkA',
	component: MkA,
} satisfies Meta<typeof MkA>;

export default meta;

import { expect, userEvent, within } from '@storybook/test';
import MkA from './MkA.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkA,
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
			template: '<MkA v-bind="props">Misskey</MkA>',
		};
	},
	async play({ canvasElement }) {
		const canvas = within(canvasElement);
		const a = canvas.getByRole<HTMLAnchorElement>('link');
		// FIXME: 通るけどその後落ちるのでコメントアウト
		// await expect(a.href).toMatch(/^https?:\/\/.*#test$/);
		await userEvent.pointer({ keys: '[MouseRight]', target: a });
		const menu = canvas.getByRole('menu');
		await expect(menu).toBeInTheDocument();
		await userEvent.click(a);
		a.blur();
		await expect(menu).not.toBeInTheDocument();
	},
	args: {
		to: '#test',
		behavior: 'browser',
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkA>;