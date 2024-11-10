/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkChartLegend',
	component: MkChartLegend,
} satisfies Meta<typeof MkChartLegend>;

export default meta;

import MkChartLegend from './MkChartLegend.vue';

void MkChartLegend;
