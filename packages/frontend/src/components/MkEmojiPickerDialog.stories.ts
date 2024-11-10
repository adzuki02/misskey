/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkEmojiPickerDialog',
	component: MkEmojiPickerDialog,
} satisfies Meta<typeof MkEmojiPickerDialog>;

export default meta;

import MkEmojiPickerDialog from './MkEmojiPickerDialog.vue';

void MkEmojiPickerDialog;
