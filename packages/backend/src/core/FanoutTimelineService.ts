/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { Inject, Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { DI } from '@/di-symbols.js';
import { bindThis } from '@/decorators.js';
import { IdService } from '@/core/IdService.js';
import type { Config } from '@/config.js';

export type FanoutTimelineName =
	// home timeline
	| `homeTimeline:${string}`
	| `homeTimelineWithFiles:${string}` // only notes with files are included
	// antenna
	| `antennaTimeline:${string}`

	// user timeline
	| `userTimeline:${string}` // replies are not included
	| `userTimelineWithFiles:${string}` // only non-reply notes with files are included
	| `userTimelineWithReplies:${string}` // only replies are included
	| `userTimelineWithChannel:${string}` // only channel notes are included, replies are included

	// user list timelines
	| `userListTimeline:${string}`
	| `userListTimelineWithFiles:${string}` // only notes with files are included

	// channel timelines
	| `channelTimeline:${string}` // replies are included

	// role timelines
	| `roleTimeline:${string}` // any notes are included

@Injectable()
export class FanoutTimelineService {
	constructor(
		@Inject(DI.redisForTimelines)
		private redisForTimelines: Redis.Redis,

		@Inject(DI.config)
		private config: Config,

		private idService: IdService,
	) {
	}

	@bindThis
	public push(tl: FanoutTimelineName, id: string, maxlen: number, pipeline: Redis.ChainableCommander) {
		// リモートから遅れて届いた(もしくは後から追加された)投稿日時が古い投稿が追加されるとページネーション時に問題を引き起こすため、
		// 3分以内に投稿されたものでない場合、Redisにある最古のIDより新しい場合のみ追加する
		if (this.idService.parse(id).date.getTime() > Date.now() - 1000 * 60 * 3) {
			pipeline.lpush('list:' + tl, id);
			if (Math.random() < 0.1) { // 10%の確率でトリム
				pipeline.ltrim('list:' + tl, 0, maxlen - 1);
			}
		} else {
			// 末尾のIDを取得
			this.redisForTimelines.lindex('list:' + tl, -1).then(lastId => {
				if (lastId == null || (this.idService.parse(id).date.getTime() > this.idService.parse(lastId).date.getTime())) {
					this.redisForTimelines.lpush('list:' + tl, id);
				} else {
					Promise.resolve();
				}
			});
		}
	}

	@bindThis
	public get(name: FanoutTimelineName, untilId?: string | null, sinceId?: string | null) {
		if (untilId && sinceId) {
			return this.redisForTimelines.lrange('list:' + name, 0, -1)
				.then(ids => ids.filter(id => id < untilId && id > sinceId).sort((a, b) => a > b ? -1 : 1));
		} else if (untilId) {
			return this.redisForTimelines.lrange('list:' + name, 0, -1)
				.then(ids => ids.filter(id => id < untilId).sort((a, b) => a > b ? -1 : 1));
		} else if (sinceId) {
			return this.redisForTimelines.lrange('list:' + name, 0, -1)
				.then(ids => ids.filter(id => id > sinceId).sort((a, b) => a < b ? -1 : 1));
		} else {
			return this.redisForTimelines.lrange('list:' + name, 0, -1)
				.then(ids => ids.sort((a, b) => a > b ? -1 : 1));
		}
	}

	@bindThis
	public getMulti(name: FanoutTimelineName[], untilId?: string | null, sinceId?: string | null): Promise<[string[][], string | undefined]> {
		const pipeline = this.redisForTimelines.pipeline();
		for (const n of name) {
			pipeline.lrange('list:' + n, 0, -1);
		}
		return pipeline.exec().then(res => {
			if (res == null) return [[], undefined];
			const tls = res.map(r => r[1] as string[]);

			// 基本的にRedisにある一番古いIDより新しいものだけを追加している、かつLPUSHしていくので一番右が一番古いはず
			// 空のTLがある場合はundefinedになる
			const oldestValidId = tls.map(ids => ids[ids.length - 1]).sort().pop();

			return [tls.map(ids =>
				(untilId && sinceId)
					? ids.filter(id => id < untilId && id > sinceId).sort((a, b) => a > b ? -1 : 1)
					: untilId
						? ids.filter(id => id < untilId).sort((a, b) => a > b ? -1 : 1)
						: sinceId
							? ids.filter(id => id > sinceId).sort((a, b) => a < b ? -1 : 1)
							: ids.sort((a, b) => a > b ? -1 : 1),
			), oldestValidId];
		});
	}

	@bindThis
	public purge(name: FanoutTimelineName) {
		return this.redisForTimelines.del('list:' + name);
	}

	@bindThis
	public purgeAll() {
		const keyPrefixLen = (this.config.redisForTimelines.keyPrefix as string).length;
		this.redisForTimelines.keys(`${this.config.redisForTimelines.keyPrefix}list:*`).then(
			listKeys => {
				if (listKeys.length > 0) {
					this.redisForTimelines.del(listKeys.map(key => key.slice(keyPrefixLen)));
				}
			},
		);
	}
}
