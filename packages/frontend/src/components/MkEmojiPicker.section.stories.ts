/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkEmojiPicker/section',
	component: MkEmojiPicker_section,
} satisfies Meta<typeof MkEmojiPicker_section>;

export default meta;

import MkEmojiPicker_section from './MkEmojiPicker.section.vue';

void MkEmojiPicker_section;
