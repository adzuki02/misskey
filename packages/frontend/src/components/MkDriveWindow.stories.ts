/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkDriveWindow',
	component: MkDriveWindow,
} satisfies Meta<typeof MkDriveWindow>;

export default meta;

import MkDriveWindow from './MkDriveWindow.vue';

void MkDriveWindow;
