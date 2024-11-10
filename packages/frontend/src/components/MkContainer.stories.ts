/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkContainer',
	component: MkContainer,
} satisfies Meta<typeof MkContainer>;

export default meta;

import MkContainer from './MkContainer.vue';

void MkContainer;
