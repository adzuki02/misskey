/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkAbuseReportWindow',
	component: MkAbuseReportWindow,
} satisfies Meta<typeof MkAbuseReportWindow>;

export default meta;

import MkAbuseReportWindow from './MkAbuseReportWindow.vue';
import { userDetailed } from '@/../.storybook/fakes.js';
import { commonHandlers } from '@/../.storybook/mocks.js';

export const Default = {
	render(args) {
		return {
			components: {
				MkAbuseReportWindow,
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
			template: '<MkAbuseReportWindow v-bind="props" />',
		};
	},
	args: {
		user: userDetailed(),
	},
	parameters: {
		layout: 'centered',
		msw: {
			handlers: commonHandlers,
		},
		chromatic: {
			disableSnapshot: true,
		},
	},
} satisfies StoryObj<typeof MkAbuseReportWindow>;
