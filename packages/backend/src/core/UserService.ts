/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import type { FollowingsRepository, UsersRepository } from '@/models/_.js';
import type { MiUser } from '@/models/User.js';
import { DI } from '@/di-symbols.js';
import { bindThis } from '@/decorators.js';
import { SystemWebhookService } from '@/core/SystemWebhookService.js';
import { UserEntityService } from '@/core/entities/UserEntityService.js';

@Injectable()
export class UserService {
	constructor(
		@Inject(DI.usersRepository)
		private usersRepository: UsersRepository,
		@Inject(DI.followingsRepository)
		private followingsRepository: FollowingsRepository,
		private systemWebhookService: SystemWebhookService,
		private userEntityService: UserEntityService,
	) {
	}

	/**
	 * SystemWebhookを用いてユーザに関する操作内容を管理者各位に通知する.
	 * ここではJobQueueへのエンキューのみを行うため、即時実行されない.
	 *
	 * @see SystemWebhookService.enqueueSystemWebhook
	 */
	@bindThis
	public async notifySystemWebhook(user: MiUser, type: 'userCreated') {
		const packedUser = await this.userEntityService.pack(user, null, { schema: 'UserLite' });
		const recipientWebhookIds = await this.systemWebhookService.fetchSystemWebhooks({ isActive: true, on: [type] });
		for (const webhookId of recipientWebhookIds) {
			await this.systemWebhookService.enqueueSystemWebhook(
				webhookId,
				type,
				packedUser,
			);
		}
	}
}
