/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkContextMenu',
	component: MkContextMenu,
} satisfies Meta<typeof MkContextMenu>;

export default meta;

import { userEvent, within } from '@storybook/test';
import MkContextMenu from './MkContextMenu.vue';
import * as os from '@/os.js';

export const Empty = {
	render(args) {
		return {
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
			methods: {
				onContextmenu(ev: MouseEvent) {
					os.contextMenu(args.items, ev);
				},
			},
			template: '<div @contextmenu.stop="onContextmenu">Right Click Here</div>',
		};
	},
	args: {
		items: [],
	},
	async play({ canvasElement }) {
		const canvas = within(canvasElement);
		const target = canvas.getByText('Right Click Here');
		await userEvent.pointer({ keys: '[MouseRight>]', target });
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkContextMenu>;

export const SomeTabs = {
	...Empty,
	args: {
		items: [
			{
				text: 'Home',
				icon: 'ti ti-home',
				action() {},
			},
		],
	},
} satisfies StoryObj<typeof MkContextMenu>;
