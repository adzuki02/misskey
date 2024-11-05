<!--
SPDX-FileCopyrightText: syuilo and misskey-project
SPDX-License-Identifier: AGPL-3.0-only
-->

<template>
<Mfm :text="user.name ?? user.username" :author="user" :plain="true" :nowrap="nowrap" :emojiUrls="user.emojis"/>
</template>

<script lang="ts" setup>
import type { User } from 'misskey-js/entities.js';

withDefaults(defineProps<{
	user: User;
	nowrap?: boolean;
}>(), {
	nowrap: true,
});
</script>
