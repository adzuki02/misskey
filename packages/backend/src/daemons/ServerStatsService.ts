/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as os from 'node:os';
import { Inject, Injectable } from '@nestjs/common';
import Xev from 'xev';
import { bindThis } from '@/decorators.js';
import { MiMeta } from '@/models/_.js';
import { DI } from '@/di-symbols.js';
import type { OnApplicationShutdown } from '@nestjs/common';

const ev = new Xev();

const interval = 2000;

const roundCpu = (num: number) => Math.round(num * 1000) / 1000;
const round = (num: number) => Math.round(num * 10) / 10;

@Injectable()
export class ServerStatsService implements OnApplicationShutdown {
	private intervalId: NodeJS.Timeout | null = null;

	constructor(
		@Inject(DI.meta)
		private meta: MiMeta,
	) {
	}

	/**
	 * Report server stats regularly
	 */
	@bindThis
	public async start(): Promise<void> {
		if (!this.meta.enableServerMachineStats) return;

		const log: { cpu: number, mem: number}[] = [];

		ev.on('requestServerStatsLog', x => {
			ev.emit(`serverStatsLog:${x.id}`, log.slice(0, x.length));
		});

		const tick = async () => {
			const [cpu, memStats] = await Promise.all([cpuUsage(), mem()]);

			const stats = {
				cpu: roundCpu(cpu),
				mem: round(memStats),
			};
			ev.emit('serverStats', stats);
			log.unshift(stats);
			if (log.length > 200) log.pop();
		};

		tick();

		this.intervalId = setInterval(tick, interval);
	}

	@bindThis
	public dispose(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
		}
	}

	@bindThis
	public onApplicationShutdown(signal?: string | undefined): void {
		this.dispose();
	}
}

// CPU STAT
const prevCpuUsage = { idle: 0, sum: 0 };

function cpuUsage(): Promise<number> {
	return new Promise((res) => {
		const current = os.cpus().reduce((acc, cpu) => ({ idle: acc.idle + cpu.times.idle, sum: acc.sum + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq }), { idle: 0, sum: 0 });

		const percentage = 1 - (current.idle - prevCpuUsage.idle) / (current.sum - prevCpuUsage.sum);

		prevCpuUsage.idle = current.idle;
		prevCpuUsage.sum = current.sum;

		res(percentage);
	});
}

// MEMORY STAT
async function mem(): Promise<number> {
	const notFree = os.totalmem() - os.freemem();
	return notFree;
}
