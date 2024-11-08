/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as os from 'node:os';
import { Inject, Injectable } from '@nestjs/common';
import { Endpoint } from '@/server/api/endpoint-base.js';
import { MiMeta } from '@/models/_.js';
import { DI } from '@/di-symbols.js';

export const meta = {
	requireCredential: false,
	allowGet: true,
	cacheSec: 60 * 10,

	tags: ['meta'],
	res: {
		type: 'object',
		optional: false, nullable: false,
		properties: {
			mem: {
				type: 'object',
				properties: {
					total: {
						type: 'number',
						nullable: false,
					},
				},
			},
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {},
	required: [],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.meta)
		private serverSettings: MiMeta,
	) {
		super(meta, paramDef, async () => {
			return {
				mem: {
					total: this.serverSettings.enableServerMachineStats ? os.totalmem() : 0,
				},
			};
		});
	}
}
