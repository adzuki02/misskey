/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkAntennaEditorDialog',
	component: MkAntennaEditorDialog,
} satisfies Meta<typeof MkAntennaEditorDialog>;

export default meta;

import { action } from '@storybook/addon-actions';
import { HttpResponse, http } from 'msw';
import MkAntennaEditorDialog from './MkAntennaEditorDialog.vue';
import { commonHandlers } from '@/../.storybook/mocks.js';

export const Default = {
	render(args) {
		return {
			components: {
				MkAntennaEditorDialog,
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
				events() {
					return {
						created: action('created'),
						updated: action('updated'),
						deleted: action('deleted'),
						closed: action('closed'),
					};
				},
			},
			template: '<MkAntennaEditorDialog v-bind="props" v-on="events" />',
		};
	},
	args: {},
	parameters: {
		layout: 'centered',
		msw: {
			handlers: [
				...commonHandlers,
				http.post('/api/antennas/create', async ({ request }) => {
					action('POST /api/antennas/create')(await request.json());
					return HttpResponse.json({});
				}),
				http.post('/api/antennas/update', async ({ request }) => {
					action('POST /api/antennas/update')(await request.json());
					return HttpResponse.json({});
				}),
				http.post('/api/antennas/delete', async ({ request }) => {
					action('POST /api/antennas/delete')(await request.json());
					return HttpResponse.json();
				}),
			],
		},
	},
} satisfies StoryObj<typeof MkAntennaEditorDialog>;
