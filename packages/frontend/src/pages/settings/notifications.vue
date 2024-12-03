<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<div class="_gaps_m">
	<FormSection first>
		<template #label>{{ i18n.ts.notificationDisplay }}</template>

		<div class="_gaps_m">
			<MkSwitch v-model="useGroupedNotifications">{{ i18n.ts.useGroupedNotifications }}</MkSwitch>

			<MkRadios v-model="notificationPosition">
				<template #label>{{ i18n.ts.position }}</template>
				<option value="leftTop"><i class="ti ti-align-box-left-top"></i> {{ i18n.ts.leftTop }}</option>
				<option value="rightTop"><i class="ti ti-align-box-right-top"></i> {{ i18n.ts.rightTop }}</option>
				<option value="leftBottom"><i class="ti ti-align-box-left-bottom"></i> {{ i18n.ts.leftBottom }}</option>
				<option value="rightBottom"><i class="ti ti-align-box-right-bottom"></i> {{ i18n.ts.rightBottom }}</option>
			</MkRadios>

			<MkRadios v-model="notificationStackAxis">
				<template #label>{{ i18n.ts.stackAxis }}</template>
				<option value="vertical"><i class="ti ti-carousel-vertical"></i> {{ i18n.ts.vertical }}</option>
				<option value="horizontal"><i class="ti ti-carousel-horizontal"></i> {{ i18n.ts.horizontal }}</option>
			</MkRadios>

			<MkButton @click="testNotification">{{ i18n.ts._notification.checkNotificationBehavior }}</MkButton>
		</div>
	</FormSection>

	<FormSection>
		<template #label>{{ i18n.ts.notificationRecieveConfig }}</template>
		<div class="_gaps_s">
			<MkFolder v-for="type in notificationTypes.filter(x => !nonConfigurableNotificationTypes.includes(x))" :key="type">
				<template #label>{{ i18n.ts._notification._types[type] }}</template>
				<template #suffix>
					{{
						$i.notificationRecieveConfig[type]?.type === 'never' ? i18n.ts.none :
						$i.notificationRecieveConfig[type]?.type === 'following' ? i18n.ts.following :
						$i.notificationRecieveConfig[type]?.type === 'follower' ? i18n.ts.followers :
						$i.notificationRecieveConfig[type]?.type === 'mutualFollow' ? i18n.ts.mutualFollow :
						$i.notificationRecieveConfig[type]?.type === 'followingOrFollower' ? i18n.ts.followingOrFollower :
						$i.notificationRecieveConfig[type]?.type === 'list' ? i18n.ts.userList :
						i18n.ts.all
					}}
				</template>

				<XNotificationConfig :userLists="userLists" :value="$i.notificationRecieveConfig[type] ?? { type: 'all' }" @update="(res) => updateReceiveConfig(type, res)"/>
			</MkFolder>
		</div>
	</FormSection>
	<FormSection>
		<div class="_gaps_m">
			<FormLink to="/settings/notifications" @click="readAllNotifications">{{ i18n.ts.markAsReadAllNotifications }}</FormLink>
			<FormLink to="/settings/notifications" @click="readAllUnreadNotes">{{ i18n.ts.markAsReadAllUnreadNotes }}</FormLink>
		</div>
	</FormSection>
	<FormSection>
		<div class="_gaps_m">
			<FormLink to="/settings/notifications" @click="testNotification">{{ i18n.ts._notification.sendTestNotification }}</FormLink>
			<FormLink to="/settings/notifications" @click="flushNotification">{{ i18n.ts._notification.flushNotification }}</FormLink>
		</div>
	</FormSection>
</div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import XNotificationConfig from './notifications.notification-config.vue';
import FormLink from '@/components/form/link.vue';
import FormSection from '@/components/form/section.vue';
import MkButton from '@/components/MkButton.vue';
import MkFolder from '@/components/MkFolder.vue';
import MkRadios from '@/components/MkRadios.vue';
import MkSwitch from '@/components/MkSwitch.vue';
import * as os from '@/os.js';
import { signinRequired } from '@/account.js';
import { misskeyApi } from '@/scripts/misskey-api.js';
import { i18n } from '@/i18n.js';
import { definePageMetadata } from '@/scripts/page-metadata.js';
import { notificationTypes } from '@/const.js';
import { defaultStore } from '@/store.js';

const $i = signinRequired();

const useGroupedNotifications = computed(defaultStore.makeGetterSetter('useGroupedNotifications'));
const notificationPosition = computed(defaultStore.makeGetterSetter('notificationPosition'));
const notificationStackAxis = computed(defaultStore.makeGetterSetter('notificationStackAxis'));

const nonConfigurableNotificationTypes = ['note', 'roleAssigned', 'followRequestAccepted'];

const userLists = await misskeyApi('users/lists/list');

async function readAllUnreadNotes() {
	await os.apiWithDialog('i/read-all-unread-notes', {});
}

async function readAllNotifications() {
	await os.apiWithDialog('notifications/mark-all-as-read', {});
}

async function updateReceiveConfig(type, value) {
	await os.apiWithDialog('i/update', {
		notificationRecieveConfig: {
			...$i.notificationRecieveConfig,
			[type]: value,
		},
	}).then(i => {
		$i.notificationRecieveConfig = i.notificationRecieveConfig;
	});
}

function testNotification(): void {
	misskeyApi('notifications/test-notification');
}

async function flushNotification() {
	const { canceled } = await os.confirm({
		type: 'warning',
		text: i18n.ts.resetAreYouSure,
	});

	if (canceled) return;

	os.apiWithDialog('notifications/flush', {});
}

definePageMetadata(() => ({
	title: i18n.ts.notifications,
	icon: 'ti ti-bell',
}));
</script>
