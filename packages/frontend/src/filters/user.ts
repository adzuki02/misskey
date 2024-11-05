/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { toString as acctToString, type Acct } from 'misskey-js/acct.js';
import type { User } from 'misskey-js/entities.js';
import { url } from '@/config.js';

export const acct = (user: Acct) => {
	return acctToString(user);
};

export const userName = (user: User) => {
	return user.name || user.username;
};

export const userPage = (user: Acct, path?: string, absolute = false) => {
	return `${absolute ? url : ''}/@${acct(user)}${(path ? `/${path}` : '')}`;
};
