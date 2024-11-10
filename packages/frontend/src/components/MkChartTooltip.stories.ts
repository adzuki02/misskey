/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkChartTooltip',
	component: MkChartTooltip,
} satisfies Meta<typeof MkChartTooltip>;

export default meta;

import MkChartTooltip from './MkChartTooltip.vue';

void MkChartTooltip;
