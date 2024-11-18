/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { defineAsyncComponent } from 'vue';
import type { DriveFile, DriveFolder } from 'misskey-js/entities.js';
import { i18n } from '@/i18n.js';
import { copyToClipboard } from '@/scripts/copy-to-clipboard.js';
import * as os from '@/os.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { MenuItem } from '@/types/menu.js';
import { defaultStore } from '@/store.js';

function rename(file: DriveFile) {
	os.inputText({
		title: i18n.ts.renameFile,
		placeholder: i18n.ts.inputNewFileName,
		default: file.name,
	}).then(({ canceled, result: name }) => {
		if (canceled) return;
		misskeyApi('drive/files/update', {
			fileId: file.id,
			name: name,
		});
	});
}

function describe(file: DriveFile) {
	const { dispose } = os.popup(defineAsyncComponent(() => import('@/components/MkFileCaptionEditWindow.vue')), {
		default: file.comment ?? '',
		file: file,
	}, {
		done: caption => {
			misskeyApi('drive/files/update', {
				fileId: file.id,
				comment: caption.length === 0 ? null : caption,
			});
		},
		closed: () => dispose(),
	});
}

function move(file: DriveFile) {
	os.selectDriveFolder(false).then(folder => {
		misskeyApi('drive/files/update', {
			fileId: file.id,
			folderId: folder[0] ? folder[0].id : null,
		});
	});
}

function toggleSensitive(file: DriveFile) {
	misskeyApi('drive/files/update', {
		fileId: file.id,
		isSensitive: !file.isSensitive,
	}).catch(err => {
		os.alert({
			type: 'error',
			title: i18n.ts.error,
			text: err.message,
		});
	});
}

function copyUrl(file: DriveFile) {
	copyToClipboard(file.url);
	os.success();
}

/*
function addApp() {
	alert('not implemented yet');
}
*/
async function deleteFile(file: DriveFile) {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.tsx.driveFileDeleteConfirm({ name: file.name }),
	});

	if (canceled) return;
	misskeyApi('drive/files/delete', {
		fileId: file.id,
	});
}

export function getDriveFileMenu(file: DriveFile, folder?: DriveFolder | null): MenuItem[] {
	const menu: MenuItem[] = [
		{
			type: 'link',
			to: `/my/drive/file/${file.id}`,
			text: i18n.ts._fileViewer.title,
			icon: 'ti ti-info-circle',
		},
		{ type: 'divider' },
		{
			text: i18n.ts.rename,
			icon: 'ti ti-forms',
			action: () => rename(file),
		},
		{
			text: i18n.ts.move,
			icon: 'ti ti-folder-symlink',
			action: () => move(file),
		},
		{
			text: file.isSensitive ? i18n.ts.unmarkAsSensitive : i18n.ts.markAsSensitive,
			icon: file.isSensitive ? 'ti ti-eye' : 'ti ti-eye-exclamation',
			action: () => toggleSensitive(file),
		},
		{
			text: i18n.ts.describeFile,
			icon: 'ti ti-text-caption',
			action: () => describe(file),
		},
		{ type: 'divider' },
		{
			text: i18n.ts.createNoteFromTheFile,
			icon: 'ti ti-pencil',
			action: () => os.post({
				initialFiles: [file],
			}),
		},
		{
			text: i18n.ts.copyUrl,
			icon: 'ti ti-link',
			action: () => copyUrl(file),
		},
		{
			type: 'a',
			href: file.url,
			target: '_blank',
			text: i18n.ts.download,
			icon: 'ti ti-download',
			download: file.name,
		},
		{ type: 'divider' },
		{
			text: i18n.ts.delete,
			icon: 'ti ti-trash',
			danger: true,
			action: () => deleteFile(file),
		},
	];

	if (defaultStore.state.devMode) {
		menu.push(
			{ type: 'divider' },
			{
				icon: 'ti ti-id',
				text: i18n.ts.copyFileId,
				action: () => {
					copyToClipboard(file.id);
				},
			},
		);
	}

	return menu;
}
