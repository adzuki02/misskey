/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkDateSeparatedList',
	component: MkDateSeparatedList,
} satisfies Meta<typeof MkDateSeparatedList>;

export default meta;

import MkDateSeparatedList from './MkDateSeparatedList.vue';

void MkDateSeparatedList;
