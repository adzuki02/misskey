/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

type UriEncodable = Parameters<typeof encodeURIComponent>[0];

/* objを検査して
 * 1. 配列に何も入っていない時はクエリを付けない
 * 2. プロパティがundefinedの時はクエリを付けない
 * （new URLSearchParams(obj)ではそこまで丁寧なことをしてくれない）
 */
export function query(obj: Record<string, UriEncodable | UriEncodable[]>): string {
	const params = Object.entries(obj)
		.filter(([, v]) => !Array.isArray(v) || v.length)
		.reduce((a, [k, v]) => (a[k] = v, a), {} as Record<string, UriEncodable | UriEncodable[]>);

	return Object.entries(params)
		.map((p) => `${p[0]}=${encodeURIComponent(p[1] as UriEncodable)}`)
		.join('&');
}

// eslint-disable-next-line no-shadow
export function appendQuery(url: string, query: string): string {
	return `${url}${/\?/.test(url) ? url.endsWith('?') ? '' : '&' : '?'}${query}`;
}

export function extractDomain(url: string) {
	const match = url.match(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?([^:\/\n]+)/im);
	return match ? match[1] : null;
}
