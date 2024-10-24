/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { initTestDb, sendEnvResetRequest } from './utils.js';

beforeAll(async () => {
	process.stdout.write('calling initTestDb (jest.setup.ts:beforeAll)\n');
	await initTestDb(false);
	process.stdout.write('initTestDb returned (jest.setup.ts:beforeAll)\n');
	await sendEnvResetRequest();
	process.stdout.write('env reset request sent (jest.setup.ts:beforeAll)\n');
});
