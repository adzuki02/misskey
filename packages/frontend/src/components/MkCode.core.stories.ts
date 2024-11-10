/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkCode/core',
	component: MkCode_core,
} satisfies Meta<typeof MkCode_core>;

export default meta;

import MkCode_core from './MkCode.core.vue';

void MkCode_core;
