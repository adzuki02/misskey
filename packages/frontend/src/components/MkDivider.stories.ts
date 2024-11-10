/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkDivider',
	component: MkDivider,
} satisfies Meta<typeof MkDivider>;

export default meta;

import MkDivider from './MkDivider.vue';

void MkDivider;
