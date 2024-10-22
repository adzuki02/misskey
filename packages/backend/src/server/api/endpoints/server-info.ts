/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as os from 'node:os';
import { statfs } from 'node:fs/promises';
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
			machine: {
				type: 'string',
				nullable: false,
			},
			cpu: {
				type: 'object',
				nullable: false,
				properties: {
					model: {
						type: 'string',
						nullable: false,
					},
					cores: {
						type: 'number',
						nullable: false,
					},
				},
			},
			mem: {
				type: 'object',
				properties: {
					total: {
						type: 'number',
						nullable: false,
					},
				},
			},
			fs: {
				type: 'object',
				nullable: false,
				properties: {
					total: {
						type: 'number',
						nullable: false,
					},
					used: {
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
			if (!this.serverSettings.enableServerMachineStats) return {
				machine: '?',
				cpu: {
					model: '?',
					cores: 0,
				},
				mem: {
					total: 0,
				},
				fs: {
					total: 0,
					used: 0,
				},
			};

			const fsStats = await statfs('/').catch(() => ({ blocks: 0, bavail: 0, bsize: 0 }));

			return {
				machine: 'N/A',
				cpu: {
					model: 'N/A',
					cores: os.cpus().length,
				},
				mem: {
					total: os.totalmem(),
				},
				fs: {
					total: fsStats.blocks * fsStats.bsize,
					used: (fsStats.blocks - fsStats.bavail) * fsStats.bsize,
				},
			};
		});
	}
}
