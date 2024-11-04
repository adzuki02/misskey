/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { UnicodeEmojiDef } from './emojilist.js';
import type { MeDetailed, Note, EmojiSimple } from 'misskey-js/entities.js';

export function checkReactionPermissions(me: MeDetailed, note: Note, emoji: EmojiSimple | UnicodeEmojiDef | string): boolean {
	if (typeof emoji === 'string') return true; // UnicodeEmojiDefにも無い絵文字であれば文字列で来る。Unicode絵文字であることには変わりないので常にリアクション可能とする;
	if ('char' in emoji) return true; // UnicodeEmojiDefなら常にリアクション可能

	const roleIdsThatCanBeUsedThisEmojiAsReaction = emoji.roleIdsThatCanBeUsedThisEmojiAsReaction ?? [];
	return !(emoji.localOnly && note.user.host !== me.host)
      && !(emoji.isSensitive && (note.reactionAcceptance === 'nonSensitiveOnly' || note.reactionAcceptance === 'nonSensitiveOnlyForLocalLikeOnlyForRemote'))
      && (roleIdsThatCanBeUsedThisEmojiAsReaction.length === 0 || me.roles.some(role => roleIdsThatCanBeUsedThisEmojiAsReaction.includes(role.id)));
}
