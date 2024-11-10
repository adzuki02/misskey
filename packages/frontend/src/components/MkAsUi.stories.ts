/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkAsUi',
	component: MkAsUi,
} satisfies Meta<typeof MkAsUi>;

export default meta;

import MkAsUi from './MkAsUi.vue';

void MkAsUi;
