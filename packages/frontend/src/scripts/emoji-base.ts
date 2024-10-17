/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const twemojiSvgBase = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg';

export function char2twemojiFilePath(char: string): string {
	let codes = Array.from(char, x => x.codePointAt(0)?.toString(16));
	if (!codes.includes('200d')) codes = codes.filter(x => x !== 'fe0f');
	codes = codes.filter(x => x && x.length);
	const fileName = codes.join('-');
	return `${twemojiSvgBase}/${fileName}.svg`;
}
