/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkDigitalClock',
	component: MkDigitalClock,
} satisfies Meta<typeof MkDigitalClock>;

export default meta;

import isChromatic from 'chromatic/isChromatic';
import MkDigitalClock from './MkDigitalClock.vue';

export const Default = {
	render(args) {
		return {
			components: {
				MkDigitalClock,
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
			template: '<MkDigitalClock v-bind="props" />',
		};
	},
	args: {
		now: isChromatic() ? () => new Date('2023-01-01T10:10:30') : undefined,
	},
	parameters: {
		layout: 'centered',
	},
} satisfies StoryObj<typeof MkDigitalClock>;
