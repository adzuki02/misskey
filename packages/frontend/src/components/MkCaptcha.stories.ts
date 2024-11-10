/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/MkCaptcha',
	component: MkCaptcha,
} satisfies Meta<typeof MkCaptcha>;

export default meta;

import MkCaptcha from './MkCaptcha.vue';

void MkCaptcha;
