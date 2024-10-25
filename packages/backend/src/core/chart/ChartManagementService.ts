/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Injectable } from '@nestjs/common';

import { bindThis } from '@/decorators.js';
import FederationChart from './charts/federation.js';
import NotesChart from './charts/notes.js';
import UsersChart from './charts/users.js';
import InstanceChart from './charts/instance.js';
import DriveChart from './charts/drive.js';
import ApRequestChart from './charts/ap-request.js';
import type { OnApplicationShutdown } from '@nestjs/common';

@Injectable()
export class ChartManagementService implements OnApplicationShutdown {
	private charts;
	private saveIntervalId: NodeJS.Timeout;

	constructor(
		private federationChart: FederationChart,
		private notesChart: NotesChart,
		private usersChart: UsersChart,
		private instanceChart: InstanceChart,
		private driveChart: DriveChart,
		private apRequestChart: ApRequestChart,
	) {
		this.charts = [
			this.federationChart,
			this.notesChart,
			this.usersChart,
			this.instanceChart,
			this.driveChart,
			this.apRequestChart,
		];
	}

	@bindThis
	public async start() {
		// 20分おきにメモリ情報をDBに書き込み
		this.saveIntervalId = setInterval(() => {
			for (const chart of this.charts) {
				chart.save();
			}
		}, 1000 * 60 * 20);
	}

	@bindThis
	public async dispose(): Promise<void> {
		clearInterval(this.saveIntervalId);
		if (process.env.NODE_ENV !== 'test') {
			await Promise.all(
				this.charts.map(chart => chart.save()),
			);
		}
	}

	@bindThis
	async onApplicationShutdown(signal: string): Promise<void> {
		await this.dispose();
	}
}
