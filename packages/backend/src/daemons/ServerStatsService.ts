/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import * as os from 'node:os';
import { readFile } from 'node:fs/promises';
import { Inject, Injectable } from '@nestjs/common';
import Xev from 'xev';
import { bindThis } from '@/decorators.js';
import type { OnApplicationShutdown } from '@nestjs/common';
import { MiMeta } from '@/models/_.js';
import { DI } from '@/di-symbols.js';

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

		const log = [] as any[];

		ev.on('requestServerStatsLog', x => {
			ev.emit(`serverStatsLog:${x.id}`, log.slice(0, x.length));
		});

		const tick = async () => {
			const [cpu, memStats, netStats, fsStats] = await Promise.all([cpuUsage(), mem(), net(), fs()]);

			const stats = {
				cpu: roundCpu(cpu),
				mem: {
					used: round(memStats.used),
					active: round(memStats.active),
				},
				net: {
					rx: round(Math.max(0, netStats.rx_sec)),
					tx: round(Math.max(0, netStats.tx_sec)),
				},
				fs: {
					r: round(Math.max(0, fsStats.rIO_sec)),
					w: round(Math.max(0, fsStats.wIO_sec)),
				},
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
	return new Promise((res, rej) => {
		const current = os.cpus().reduce((acc, cpu) => ({ idle: acc.idle + cpu.times.idle, sum: acc.sum + cpu.times.user + cpu.times.nice + cpu.times.sys + cpu.times.idle + cpu.times.irq }), { idle: 0, sum: 0 });

		const percentage = 1 - (current.idle - prevCpuUsage.idle) / (current.sum - prevCpuUsage.sum);

		prevCpuUsage.idle = current.idle;
		prevCpuUsage.sum = current.sum;

		res(percentage);
	});
}

// MEMORY STAT
async function mem(): Promise<{ used: number, active: number }> {
	const notFree = os.totalmem() - os.freemem();
	return { used: notFree, active: notFree };
}

// NETWORK STAT
const prevNetBytes = { rx: Number.MAX_SAFE_INTEGER, tx: Number.MAX_SAFE_INTEGER };

async function net() {
	const iface = await readFile('/proc/net/route', { encoding: 'utf-8' }).then(str => str.split('\n').filter(str => parseInt(str.split('\t', 4)[3], 16) === 3).map(str => str.split('\t', 1)[0])[0]).catch(() => 'N/A');

	return new Promise<{ rx_sec: number, tx_sec: number }>((res, rej) => {
		Promise.all([
			readFile(`/sys/class/net/${iface}/statistics/rx_bytes`, { encoding: 'utf-8' }).then(str => parseInt(str)).catch(() => 0),
			readFile(`/sys/class/net/${iface}/statistics/tx_bytes`, { encoding: 'utf-8' }).then(str => parseInt(str)).catch(() => 0),
		]).then(arr => {
			const netStats = {
				rx_sec: (arr[0] - prevNetBytes.rx) / (interval / 1000),
				tx_sec: (arr[1] - prevNetBytes.tx) / (interval / 1000),
			};

			prevNetBytes.rx = arr[0];
			prevNetBytes.tx = arr[1];

			res(netStats);
		}).catch(() => {
			res({ rx_sec: 0, tx_sec: 0 });
		});
	});
}

// FS STAT
const prevFsIO = { rIO: Number.MAX_SAFE_INTEGER, wIO: Number.MAX_SAFE_INTEGER };

async function fs() {
	return new Promise<{ rIO_sec: number, wIO_sec: number }>((res, rej) => {
		readFile('/sys/block/sda/stat', { encoding: 'utf-8' }).then(str => {
			const stats = str.split(' ').filter(s => s !== '');

			const rIO = parseInt(stats[0]);
			const wIO = parseInt(stats[4]);

			const fsStats = {
				rIO_sec: (rIO - prevFsIO.rIO) / (interval / 1000),
				wIO_sec: (wIO - prevFsIO.wIO) / (interval / 1000),
			};

			prevFsIO.rIO = rIO;
			prevFsIO.wIO = wIO;

			res(fsStats);
		}).catch(() => {
			res({ rIO_sec: 0, wIO_sec: 0 });
		});
	});
}
