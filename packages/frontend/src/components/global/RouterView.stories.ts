/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Meta, type StoryObj } from '@storybook/vue3';

const meta = {
	title: 'components/global/RouterView',
	component: RouterView,
} satisfies Meta<typeof RouterView>;

export default meta;

import RouterView from './RouterView.vue';

void RouterView;
