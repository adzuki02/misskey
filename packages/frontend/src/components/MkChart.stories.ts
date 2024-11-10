/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkChart',
	component: MkChart,
} satisfies Meta<typeof MkChart>;

export default meta;

import { http } from 'msw';
import MkChart from './MkChart.vue';
import { commonHandlers } from '@/../.storybook/mocks.js';
import { getChartResolver } from '@/../.storybook/charts.js';

const Base = {
	render(args) {
		return {
			components: {
				MkChart,
			},
			setup() {
				return {
					args,
				};
			},
			computed: {
				props() {
					return {
						...this.args,
					};
				},
			},
			template: '<MkChart v-bind="props" />',
		};
	},
	args: {
		src: 'federation',
		span: 'hour',
		nowForChromatic: 1716263640000,
	},
	parameters: {
		layout: 'centered',
		msw: {
			handlers: [
				...commonHandlers,
				http.post(
					'/api/charts/federation',
					getChartResolver([
						'deliveredInstances',
						'inboxInstances',
						'stalled',
						'sub',
						'pub',
						'pubsub',
						'subActive',
						'pubActive',
					]),
				),
				http.post(
					'/api/charts/notes',
					getChartResolver(['local.total', 'remote.total'], {
						accumulate: true,
					}),
				),
				http.post(
					'/api/charts/drive',
					getChartResolver(
						[
							'local.incSize',
							'local.decSize',
							'remote.incSize',
							'remote.decSize',
						],
						{
							mulMap: {
								'local.incSize': 1e7,
								'local.decSize': 5e6,
								'remote.incSize': 1e6,
								'remote.decSize': 5e5,
							},
						},
					),
				),
			],
		},
	},
} satisfies StoryObj<typeof MkChart>;

export const FederationChart = {
	...Base,
	args: {
		...Base.args,
		src: 'federation',
	},
} satisfies StoryObj<typeof MkChart>;

export const NotesTotalChart = {
	...Base,
	args: {
		...Base.args,
		src: 'notes-total',
	},
} satisfies StoryObj<typeof MkChart>;

export const DriveChart = {
	...Base,
	args: {
		...Base.args,
		src: 'drive',
	},
} satisfies StoryObj<typeof MkChart>;
