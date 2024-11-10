/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkCustomEmojiDetailedDialog',
	component: MkCustomEmojiDetailedDialog,
} satisfies Meta<typeof MkCustomEmojiDetailedDialog>;

export default meta;

import MkCustomEmojiDetailedDialog from './MkCustomEmojiDetailedDialog.vue';
import { emojiDetailed } from '@/../.storybook/fakes.js';

export const Default = {
	render(args) {
		return {
			components: {
				MkCustomEmojiDetailedDialog,
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
			template: '<MkCustomEmojiDetailedDialog v-bind="props" />',
		};
	},
	args: {
		emoji: {
			...emojiDetailed(),
			host: null,
		},
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkCustomEmojiDetailedDialog>;
