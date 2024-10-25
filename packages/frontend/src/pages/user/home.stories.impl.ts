/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { StoryObj } from '@storybook/vue3';
import { HttpResponse, http } from 'msw';
import { userDetailed } from '../../../.storybook/fakes.js';
import { commonHandlers } from '../../../.storybook/mocks.js';
import home_ from './home.vue';
export const Default = {
	render(args) {
		return {
			components: {
				home_,
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
			template: '<home_ v-bind="props" />',
		};
	},
	args: {
		user: userDetailed(),
		disableNotes: false,
	},
	parameters: {
		layout: 'fullscreen',
		msw: {
			handlers: [
				...commonHandlers,
				http.post('/api/users/notes', () => {
					return HttpResponse.json([]);
				}),
			],
		},
		chromatic: {
			// `XActivity` is not compatible with Chromatic for now
			disableSnapshot: true,
		},
	},
} satisfies StoryObj<typeof home_>;
