/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { EventEmitter } from 'eventemitter3';
import type { Notification } from 'misskey-js/entities.js';

export const globalEvents = new EventEmitter<{
	themeChanged: () => void;
	clientNotification: (notification: Notification) => void;
	requestClearPageCache: () => void;
}>();
