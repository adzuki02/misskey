/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

// test is located in test/extract-mentions

import { extract as mfmExtract, type MfmNode, type MfmMention } from 'mfm-js';

export function extractMentions(nodes: MfmNode[]): MfmMention['props'][] {
	// TODO: 重複を削除
	const mentionNodes = mfmExtract(nodes, (node) => node.type === 'mention') as MfmMention[];
	const mentions = mentionNodes.map(x => x.props);

	return mentions;
}
