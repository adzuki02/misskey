/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import { getJsonSchema } from '@/core/chart/core.js';
import { Endpoint } from '@/server/api/endpoint-base.js';
import PerUserReactionsChart from '@/core/chart/charts/per-user-reactions.js';
import { schema } from '@/core/chart/charts/entities/per-user-reactions.js';
import type { UsersRepository } from '@/models/_.js';
import { DI } from '@/di-symbols.js';
import { CacheService } from '@/core/CacheService.js';
import { RoleService } from '@/core/RoleService.js';
import { ApiError } from '../../../error.js';

export const meta = {
	tags: ['charts', 'users', 'reactions'],

	res: getJsonSchema(schema),

	requireCredential: true,

	kind: 'read:account',

	errors: {
		accessDenied: {
			message: 'Access denied.',
			code: 'ACCESS_DENIED',
			id: '47954d96-c146-4f5a-b145-ffc5252b906c',
		},
	},
} as const;

export const paramDef = {
	type: 'object',
	properties: {
		span: { type: 'string', enum: ['day', 'hour'] },
		limit: { type: 'integer', minimum: 1, maximum: 500, default: 30 },
		offset: { type: 'integer', nullable: true, default: null },
		userId: { type: 'string', format: 'misskey:id' },
	},
	required: ['span', 'userId'],
} as const;

@Injectable()
export default class extends Endpoint<typeof meta, typeof paramDef> { // eslint-disable-line import/no-default-export
	constructor(
		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,

		private perUserReactionsChart: PerUserReactionsChart,
		private cacheService: CacheService,
		private roleService: RoleService,
	) {
		super(meta, paramDef, async (ps, me) => {
			if (!await this.roleService.isModerator(me)) {
				const user = await this.cacheService.userByIdCache.fetchMaybe(
					ps.userId,
					() => this.usersRepository.findOneBy({ id: ps.userId }).then(x => x ?? undefined),
				);

				if (user?.id !== me.id) {
					throw new ApiError(meta.errors.accessDenied);
				}
			}

			return await this.perUserReactionsChart.getChart(ps.span, ps.limit, ps.offset ? new Date(ps.offset) : null, ps.userId);
		});
	}
}
