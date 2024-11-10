/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkDriveSelectDialog',
	component: MkDriveSelectDialog,
} satisfies Meta<typeof MkDriveSelectDialog>;

export default meta;

import MkDriveSelectDialog from './MkDriveSelectDialog.vue';

void MkDriveSelectDialog;
