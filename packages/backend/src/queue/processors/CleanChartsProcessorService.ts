/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Injectable } from '@nestjs/common';
import type Logger from '@/logger.js';
import FederationChart from '@/core/chart/charts/federation.js';
import NotesChart from '@/core/chart/charts/notes.js';
import UsersChart from '@/core/chart/charts/users.js';
import ActiveUsersChart from '@/core/chart/charts/active-users.js';
import InstanceChart from '@/core/chart/charts/instance.js';
import DriveChart from '@/core/chart/charts/drive.js';
import ApRequestChart from '@/core/chart/charts/ap-request.js';
import { bindThis } from '@/decorators.js';
import { QueueLoggerService } from '../QueueLoggerService.js';
import type * as Bull from 'bullmq';

@Injectable()
export class CleanChartsProcessorService {
	private logger: Logger;

	constructor(
		private federationChart: FederationChart,
		private notesChart: NotesChart,
		private usersChart: UsersChart,
		private activeUsersChart: ActiveUsersChart,
		private instanceChart: InstanceChart,
		private driveChart: DriveChart,
		private apRequestChart: ApRequestChart,

		private queueLoggerService: QueueLoggerService,
	) {
		this.logger = this.queueLoggerService.logger.createSubLogger('clean-charts');
	}

	@bindThis
	public async process(): Promise<void> {
		this.logger.info('Clean charts...');

		await Promise.all([
			this.federationChart.clean(),
			this.notesChart.clean(),
			this.usersChart.clean(),
			this.activeUsersChart.clean(),
			this.instanceChart.clean(),
			this.driveChart.clean(),
			this.apRequestChart.clean(),
		]);

		this.logger.succ('All charts successfully cleaned.');
	}
}
