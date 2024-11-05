/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { extract as mfmExtract, type MfmNode, type MfmUrl, type MfmLink } from 'mfm-js';
import { unique } from '@/scripts/array.js';

// unique without hash
// [ http://a/#1, http://a/#2, http://b/#3 ] => [ http://a/#1, http://b/#3 ]
const removeHash = (x: string) => x.replace(/#[^#]*$/, '');

export function extractUrlFromMfm(nodes: MfmNode[], respectSilentFlag = true): string[] {
	const urlNodes = mfmExtract(nodes, (node) => {
		return (node.type === 'url') || (node.type === 'link' && (!respectSilentFlag || !node.props.silent));
	}) as (MfmUrl | MfmLink)[];
	const urls: string[] = unique(urlNodes.map(x => x.props.url));

	return urls.reduce((array, url) => {
		const urlWithoutHash = removeHash(url);
		if (!array.map(x => removeHash(x)).includes(urlWithoutHash)) array.push(url);
		return array;
	}, [] as string[]);
}
