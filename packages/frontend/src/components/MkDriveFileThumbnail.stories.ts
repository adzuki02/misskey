/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable import/no-default-export */
/* eslint-disable import/no-duplicates */
/* eslint-disable import/order */
import { Meta } from '@storybook/vue3';
const meta = {
	title: 'components/MkDriveFileThumbnail',
	component: MkDriveFileThumbnail,
} satisfies Meta<typeof MkDriveFileThumbnail>;
export default meta;
/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { StoryObj } from '@storybook/vue3';
import MkDriveFileThumbnail from './MkDriveFileThumbnail.vue';
import { file } from '../../.storybook/fakes.js';
export const Default = {
	render(args) {
		return {
			components: {
				MkDriveFileThumbnail,
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
			template: '<MkDriveFileThumbnail v-bind="props" />',
		};
	},
	args: {
		file: file(),
		fit: 'contain',
	},
	parameters: {
		chromatic: {
			// NOTE: ロードが終わるまで待つ
			delay: 3000,
		},
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkDriveFileThumbnail>;
