/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { initTestDb, sendEnvResetRequest } from './utils.js';

beforeAll(async () => {
	await initTestDb(false);
	console.log('initialized test db');
	await sendEnvResetRequest();
	console.log('sent env reset request');
});
