/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Clip, UserList, Antenna, Channel } from 'misskey-js/entities.js';
import { Cache } from '@/scripts/cache.js';
import { misskeyApi } from '@/scripts/misskey-api.js';

export const clipsCache = new Cache<Clip[]>(1000 * 60 * 30, () => misskeyApi('clips/list'));
export const rolesCache = new Cache(1000 * 60 * 30, () => misskeyApi('admin/roles/list'));
export const userListsCache = new Cache<UserList[]>(1000 * 60 * 30, () => misskeyApi('users/lists/list'));
export const antennasCache = new Cache<Antenna[]>(1000 * 60 * 30, () => misskeyApi('antennas/list'));
export const favoritedChannelsCache = new Cache<Channel[]>(1000 * 60 * 30, () => misskeyApi('channels/my-favorites', { limit: 100 }));
