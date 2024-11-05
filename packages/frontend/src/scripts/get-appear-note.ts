/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { isPureRenote } from 'misskey-js/note.js';
import type { Note } from 'misskey-js/entities.js';

export function getAppearNote(note: Note) {
	return isPureRenote(note) ? note.renote : note;
}
