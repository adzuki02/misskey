/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkCode/renderer',
	component: MkCode_renderer,
} satisfies Meta<typeof MkCode_renderer>;

export default meta;

import MkCode_renderer from './MkCode.renderer.vue';

void MkCode_renderer;
