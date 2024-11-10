/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkStickyContainer',
	component: MkStickyContainer,
} satisfies Meta<typeof MkStickyContainer>;

export default meta;

import MkStickyContainer from './MkStickyContainer.vue';

void MkStickyContainer;
