/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import type { Note } from 'misskey-js/entities.js';

export function shouldCollapsed(note: Note, urls: string[]): boolean {
	const collapsed = note.cw == null && (
		note.text != null && (
			(note.text.includes('$[x2')) ||
			(note.text.includes('$[x3')) ||
			(note.text.includes('$[x4')) ||
			(note.text.includes('$[scale')) ||
			(note.text.split('\n').length > 9) ||
			(note.text.length > 500) ||
			(urls.length >= 4)
		) || (note.files && note.files.length >= 5)
	);

	return collapsed ?? false;
}
