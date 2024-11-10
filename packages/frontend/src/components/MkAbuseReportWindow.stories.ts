/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/MkAbuseReportWindow',
	component: MkAbuseReportWindow,
} satisfies Meta<typeof MkAbuseReportWindow>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StoryObj } from '@storybook/vue3';
import { userDetailed } from '../../.storybook/fakes.js';
import { commonHandlers } from '../../.storybook/mocks.js';
import MkAbuseReportWindow from './MkAbuseReportWindow.vue';
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
