/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { UserDetailed } from 'misskey-js/entities.js';
import { $i } from '@/account.js';

export function isFollowingVisibleForMe(user: UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followingVisibility === 'private') return false;
	if (user.followingVisibility === 'followers' && !user.isFollowing) return false;

	return true;
}
export function isFollowersVisibleForMe(user: UserDetailed): boolean {
	if ($i && ($i.id === user.id || $i.isAdmin || $i.isModerator)) return true;

	if (user.followersVisibility === 'private') return false;
	if (user.followersVisibility === 'followers' && !user.isFollowing) return false;

	return true;
}
