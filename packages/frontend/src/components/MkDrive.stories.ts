/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/MkDrive',
	component: MkDrive,
} satisfies Meta<typeof MkDrive>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { action } from '@storybook/addon-actions';
import { StoryObj } from '@storybook/vue3';
import { http, HttpResponse } from 'msw';
import { file, folder } from '../../.storybook/fakes.js';
import { commonHandlers } from '../../.storybook/mocks.js';
import MkDrive from './MkDrive.vue';
import type {
	DriveFoldersCreateRequest,
	DriveFoldersUpdateRequest,
} from 'misskey-js/entities.js';
export const Default = {
	render(args) {
		return {
			components: {
				MkDrive,
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
						selected: action('selected'),
						'change-selection': action('change-selection'),
						'move-root': action('move-root'),
						cd: action('cd'),
						'open-folder': action('open-folder'),
					};
				},
			},
			template: '<MkDrive v-bind="props" v-on="events" />',
		};
	},
	parameters: {
		chromatic: {
			// NOTE: ロードが終わるまで待つ
			delay: 3000,
		},
		layout: 'centered',
		msw: {
			handlers: [
				...commonHandlers,
				http.post('/api/drive/files', async ({ request }) => {
					action('POST /api/drive/files')(await request.json());
					return HttpResponse.json([file()]);
				}),
				http.post('/api/drive/folders', async ({ request }) => {
					action('POST /api/drive/folders')(await request.json());
					return HttpResponse.json([folder(crypto.randomUUID())]);
				}),
				http.post('/api/drive/folders/create', async ({ request }) => {
					const req = (await request.json()) as DriveFoldersCreateRequest;
					action('POST /api/drive/folders/create')(req);
					return HttpResponse.json(
						folder(crypto.randomUUID(), req.name, req.parentId),
					);
				}),
				http.post('/api/drive/folders/delete', async ({ request }) => {
					action('POST /api/drive/folders/delete')(await request.json());
					return HttpResponse.json(undefined, { status: 204 });
				}),
				http.post('/api/drive/folders/update', async ({ request }) => {
					const req = (await request.json()) as DriveFoldersUpdateRequest;
					action('POST /api/drive/folders/update')(req);
					return HttpResponse.json({
						...folder(),
						id: req.folderId,
						name: req.name ?? folder().name,
						parentId: req.parentId ?? folder().parentId,
					});
				}),
			],
		},
	},
} satisfies StoryObj<typeof MkDrive>;
