/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// https://github.com/typeorm/typeorm/issues/2400
import pg from 'pg';
import { DataSource, Logger } from 'typeorm';
import * as highlight from 'cli-highlight';
import { entities as charts } from '@/core/chart/entities.js';

import { MiAccessToken } from '@/models/AccessToken.js';
import { MiAntenna } from '@/models/Antenna.js';
import { MiApp } from '@/models/App.js';
import { MiAvatarDecoration } from '@/models/AvatarDecoration.js';
import { MiAuthSession } from '@/models/AuthSession.js';
import { MiBlocking } from '@/models/Blocking.js';
import { MiChannelFollowing } from '@/models/ChannelFollowing.js';
import { MiChannelFavorite } from '@/models/ChannelFavorite.js';
import { MiClip } from '@/models/Clip.js';
import { MiClipNote } from '@/models/ClipNote.js';
import { MiClipFavorite } from '@/models/ClipFavorite.js';
import { MiDriveFile } from '@/models/DriveFile.js';
import { MiDriveFolder } from '@/models/DriveFolder.js';
import { MiEmoji } from '@/models/Emoji.js';
import { MiFollowing } from '@/models/Following.js';
import { MiFollowRequest } from '@/models/FollowRequest.js';
import { MiHashtag } from '@/models/Hashtag.js';
import { MiInstance } from '@/models/Instance.js';
import { MiMeta } from '@/models/Meta.js';
import { MiMuting } from '@/models/Muting.js';
import { MiRenoteMuting } from '@/models/RenoteMuting.js';
import { MiNote } from '@/models/Note.js';
import { MiNoteReaction } from '@/models/NoteReaction.js';
import { MiNoteThreadMuting } from '@/models/NoteThreadMuting.js';
import { MiNoteUnread } from '@/models/NoteUnread.js';
import { MiPasswordResetRequest } from '@/models/PasswordResetRequest.js';
import { MiPoll } from '@/models/Poll.js';
import { MiPollVote } from '@/models/PollVote.js';
import { MiRegistrationTicket } from '@/models/RegistrationTicket.js';
import { MiRegistryItem } from '@/models/RegistryItem.js';
import { MiRelay } from '@/models/Relay.js';
import { MiSignin } from '@/models/Signin.js';
import { MiUsedUsername } from '@/models/UsedUsername.js';
import { MiUser } from '@/models/User.js';
import { MiUserIp } from '@/models/UserIp.js';
import { MiUserKeypair } from '@/models/UserKeypair.js';
import { MiUserList } from '@/models/UserList.js';
import { MiUserListFavorite } from '@/models/UserListFavorite.js';
import { MiUserListMembership } from '@/models/UserListMembership.js';
import { MiUserNotePining } from '@/models/UserNotePining.js';
import { MiUserPending } from '@/models/UserPending.js';
import { MiUserProfile } from '@/models/UserProfile.js';
import { MiUserPublickey } from '@/models/UserPublickey.js';
import { MiUserSecurityKey } from '@/models/UserSecurityKey.js';
import { MiWebhook } from '@/models/Webhook.js';
import { MiChannel } from '@/models/Channel.js';
import { MiRole } from '@/models/Role.js';
import { MiRoleAssignment } from '@/models/RoleAssignment.js';
import { MiFlash } from '@/models/Flash.js';
import { MiFlashLike } from '@/models/FlashLike.js';
import { MiUserMemo } from '@/models/UserMemo.js';

import { Config } from '@/config.js';
import MisskeyLogger from '@/logger.js';
import { envOption } from '@/env.js';
import { bindThis } from '@/decorators.js';

pg.types.setTypeParser(20, Number);

export const dbLogger = new MisskeyLogger('db');

const sqlLogger = dbLogger.createSubLogger('sql', 'gray');

class MyCustomLogger implements Logger {
	@bindThis
	private highlight(sql: string) {
		return envOption.logJson ? sql : highlight.highlight(sql, {
			language: 'sql', ignoreIllegals: true,
		});
	}

	@bindThis
	public logQuery(query: string, parameters?: any[]) {
		if (log) {
			sqlLogger.info(this.highlight(query).substring(0, 100));
		}
	}

	@bindThis
	public logQueryError(error: string, query: string, parameters?: any[]) {
		if (log) {
			sqlLogger.error(`query-error: ${this.highlight(query)}`);
		}
	}

	@bindThis
	public logQuerySlow(time: number, query: string, parameters?: any[]) {
		if (log || !envOption.logJson) {
			sqlLogger.warn(`query-slow: time: ${time}, query: ${this.highlight(query)}`);
		} else {
			sqlLogger.warn('query-slow', { query: this.highlight(query), time });
		}
	}

	@bindThis
	public logSchemaBuild(message: string) {
		if (log) {
			sqlLogger.info(message);
		}
	}

	@bindThis
	public log(message: string) {
		if (log) {
			sqlLogger.info(message);
		}
	}

	@bindThis
	public logMigration(message: string) {
		if (log || !envOption.logJson) {
			sqlLogger.info(message);
		} else {
			sqlLogger.info('migration', { message });
		}
	}
}

export const entities = [
	MiMeta,
	MiInstance,
	MiApp,
	MiAvatarDecoration,
	MiAuthSession,
	MiAccessToken,
	MiUser,
	MiUserProfile,
	MiUserKeypair,
	MiUserPublickey,
	MiUserList,
	MiUserListFavorite,
	MiUserListMembership,
	MiUserNotePining,
	MiUserSecurityKey,
	MiUsedUsername,
	MiFollowing,
	MiFollowRequest,
	MiMuting,
	MiRenoteMuting,
	MiBlocking,
	MiNote,
	MiNoteReaction,
	MiNoteThreadMuting,
	MiNoteUnread,
	MiDriveFile,
	MiDriveFolder,
	MiPoll,
	MiPollVote,
	MiEmoji,
	MiHashtag,
	MiRegistrationTicket,
	MiSignin,
	MiClip,
	MiClipNote,
	MiClipFavorite,
	MiAntenna,
	MiRelay,
	MiChannel,
	MiChannelFollowing,
	MiChannelFavorite,
	MiRegistryItem,
	MiPasswordResetRequest,
	MiUserPending,
	MiWebhook,
	MiUserIp,
	MiRole,
	MiRoleAssignment,
	MiFlash,
	MiFlashLike,
	MiUserMemo,
	...charts,
];

const log = process.env.NODE_ENV !== 'production';

export function createPostgresDataSource(config: Config) {
	return new DataSource({
		type: 'postgres',
		...(config.db.url ? {
			url: config.db.url,
		} : {
			host: config.db.host,
			port: config.db.port,
		}),
		username: config.db.user,
		password: config.db.pass,
		database: config.db.db,
		extra: {
			statement_timeout: 1000 * 10,
			...config.db.extra,
		},
		...(config.dbReplications ? {
			replication: {
				master: {
					host: config.db.host,
					port: config.db.port,
					username: config.db.user,
					password: config.db.pass,
					database: config.db.db,
				},
				slaves: config.dbSlaves!.map(rep => ({
					host: rep.host,
					port: rep.port,
					username: rep.user,
					password: rep.pass,
					database: rep.db,
				})),
			},
		} : {}),
		synchronize: process.env.NODE_ENV === 'test',
		dropSchema: process.env.NODE_ENV === 'test',
		cache: !config.db.disableCache && process.env.NODE_ENV !== 'test' ? { // dbをcloseしても何故かredisのコネクションが内部的に残り続けるようで、テストの際に支障が出るため無効にする(キャッシュも含めてテストしたいため本当は有効にしたいが...)
			type: 'ioredis',
			options: {
				...(config.redis.path ? {
					path: config.redis.path,
				} : {
					host: config.redis.host,
					port: config.redis.port,
				}),
				family: config.redis.family ?? 0,
				password: config.redis.pass,
				keyPrefix: `${config.redis.prefix}:query:`,
				db: config.redis.db ?? 0,
			},
		} : false,
		logging: log,
		logger: new MyCustomLogger(),
		maxQueryExecutionTime: 300,
		entities: entities,
		migrations: ['../../migration/*.js'],
	});
}
