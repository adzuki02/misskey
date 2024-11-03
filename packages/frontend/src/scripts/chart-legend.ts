/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Plugin } from 'chart.js';
import MkChartLegend from '@/components/MkChartLegend.vue';

export const chartLegend = (legend: InstanceType<typeof MkChartLegend>) => ({
	id: 'htmlLegend',
	afterUpdate(chart) {
		// Reuse the built-in legendItems generator
		const generate = chart.options.plugins?.legend?.labels?.generateLabels;

		const items = generate ? generate(chart) : undefined;

		if (items) legend.update(chart, items);
	},
}) as Plugin;
