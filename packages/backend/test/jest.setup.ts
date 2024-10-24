/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import nodeConsole from 'node:console';
import { initTestDb, sendEnvResetRequest } from './utils.js';

beforeAll(async () => {
	process.stdout.write('calling initTestDb\n');
	await initTestDb(false);
	process.stdout.write('initTestDb returned\n');
	await sendEnvResetRequest();
	process.stdout.write('env reset request sent\n');
});
