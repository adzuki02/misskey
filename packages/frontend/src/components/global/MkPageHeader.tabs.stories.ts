/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/MkPageHeader/tabs',
	component: MkPageHeader_tabs,
} satisfies Meta<typeof MkPageHeader_tabs>;

export default meta;

import MkPageHeader_tabs from './MkPageHeader.tabs.vue';

void MkPageHeader_tabs;
