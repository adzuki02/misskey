/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

import { App, defineAsyncComponent } from 'vue';

export default function(app: App) {
	app.component('WidgetProfile', defineAsyncComponent(() => import('./WidgetProfile.vue')));
	app.component('WidgetInstanceInfo', defineAsyncComponent(() => import('./WidgetInstanceInfo.vue')));
	app.component('WidgetMemo', defineAsyncComponent(() => import('./WidgetMemo.vue')));
	app.component('WidgetNotifications', defineAsyncComponent(() => import('./WidgetNotifications.vue')));
	app.component('WidgetTimeline', defineAsyncComponent(() => import('./WidgetTimeline.vue')));
	app.component('WidgetCalendar', defineAsyncComponent(() => import('./WidgetCalendar.vue')));
	app.component('WidgetClock', defineAsyncComponent(() => import('./WidgetClock.vue')));
	app.component('WidgetPhotos', defineAsyncComponent(() => import('./WidgetPhotos.vue')));
	app.component('WidgetDigitalClock', defineAsyncComponent(() => import('./WidgetDigitalClock.vue')));
	app.component('WidgetUnixClock', defineAsyncComponent(() => import('./WidgetUnixClock.vue')));
	app.component('WidgetFederation', defineAsyncComponent(() => import('./WidgetFederation.vue')));
	app.component('WidgetPostForm', defineAsyncComponent(() => import('./WidgetPostForm.vue')));
	app.component('WidgetServerMetric', defineAsyncComponent(() => import('./server-metric/index.vue')));
	app.component('WidgetJobQueue', defineAsyncComponent(() => import('./WidgetJobQueue.vue')));
	app.component('WidgetButton', defineAsyncComponent(() => import('./WidgetButton.vue')));
	app.component('WidgetAiscript', defineAsyncComponent(() => import('./WidgetAiscript.vue')));
	app.component('WidgetAiscriptApp', defineAsyncComponent(() => import('./WidgetAiscriptApp.vue')));
	app.component('WidgetUserList', defineAsyncComponent(() => import('./WidgetUserList.vue')));
	app.component('WidgetBirthdayFollowings', defineAsyncComponent(() => import('./WidgetBirthdayFollowings.vue')));
}

export const widgets = [
	'profile',
	'instanceInfo',
	'memo',
	'notifications',
	'timeline',
	'calendar',
	'clock',
	'photos',
	'digitalClock',
	'unixClock',
	'federation',
	'postForm',
	'serverMetric',
	'jobQueue',
	'button',
	'aiscript',
	'aiscriptApp',
	'userList',
	'birthdayFollowings',
];
