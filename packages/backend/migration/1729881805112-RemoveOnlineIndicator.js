const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class RemoveOnlineIndicator1729881805112 {
    name = 'RemoveOnlineIndicator1729881805112'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_systemWebhookId"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_isActive"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_method"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_abuse_report_notification_recipient_systemWebhookId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ce62b50d882d4e9dee10ad0d2f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "hideOnlineStatus"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isHibernated"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveDate"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "isFollowerHibernated"`);
        await queryRunner.query(`ALTER TABLE "system_webhook" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_followersVisibility_enum" RENAME TO "user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_followersvisibility_enum" AS ENUM('public', 'followers', 'private')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" TYPE "public"."user_profile_followersvisibility_enum" USING "followersVisibility"::"text"::"public"."user_profile_followersvisibility_enum"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" SET DEFAULT 'public'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId1"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "updatedAt" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "userId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "systemWebhookId" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "disableRegistration" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{ "admin", "administrator", "root", "system", "maintainer", "host", "mod", "moderator", "owner", "superuser", "staff", "auth", "i", "me", "everyone", "all", "mention", "mentions", "example", "user", "users", "account", "accounts", "official", "help", "helps", "support", "supports", "info", "information", "informations", "announce", "announces", "announcement", "announcements", "notice", "notification", "notifications", "dev", "developer", "developers", "tech", "misskey" }'`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewRequireContentLength" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewUserAgent" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "flash" ALTER COLUMN "visibility" SET NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_58699f75b9cf904f5f007909cb" ON "user_profile" ("birthday") `);
        await queryRunner.query(`CREATE INDEX "IDX_bd5de500bac2e158a7bf8426e8" ON "abuse_report_notification_recipient" ("isActive") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c8ef2211cf3cee665d75d5e90" ON "abuse_report_notification_recipient" ("method") `);
        await queryRunner.query(`CREATE INDEX "IDX_ffb3900031cf2fa6af1e1cb3e3" ON "abuse_report_notification_recipient" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e0740f3b5b4290103ecf33b72" ON "abuse_report_notification_recipient" ("systemWebhookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d74d8ab5efa7e3bb82825c0fa2" ON "following" ("followeeId", "followerHost") `);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId2" FOREIGN KEY ("userId") REFERENCES "user_profile"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_5e0740f3b5b4290103ecf33b722" FOREIGN KEY ("systemWebhookId") REFERENCES "system_webhook"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_5e0740f3b5b4290103ecf33b722"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId2"`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" DROP CONSTRAINT "FK_abuse_report_notification_recipient_userId1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d74d8ab5efa7e3bb82825c0fa2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e0740f3b5b4290103ecf33b72"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ffb3900031cf2fa6af1e1cb3e3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c8ef2211cf3cee665d75d5e90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bd5de500bac2e158a7bf8426e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_58699f75b9cf904f5f007909cb"`);
        await queryRunner.query(`ALTER TABLE "flash" ALTER COLUMN "visibility" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewUserAgent" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "urlPreviewRequireContentLength" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "preservedUsernames" SET DEFAULT '{admin,administrator,root,system,maintainer,host,mod,moderator,owner,superuser,staff,auth,i,me,everyone,all,mention,mentions,example,user,users,account,accounts,official,help,helps,support,supports,info,information,informations,announce,announces,announcement,announcements,notice,notification,notifications,dev,developer,developers,tech,misskey}'`);
        await queryRunner.query(`ALTER TABLE "meta" ALTER COLUMN "disableRegistration" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "systemWebhookId" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "userId" SET DEFAULT NULL`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TYPE "public"."user_profile_followersVisibility_enum_old" AS ENUM('public', 'followers', 'private')`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" TYPE "public"."user_profile_followersVisibility_enum_old" USING "followersVisibility"::"text"::"public"."user_profile_followersVisibility_enum_old"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "followersVisibility" SET DEFAULT 'public'`);
        await queryRunner.query(`DROP TYPE "public"."user_profile_followersvisibility_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."user_profile_followersVisibility_enum_old" RENAME TO "user_profile_followersVisibility_enum"`);
        await queryRunner.query(`ALTER TABLE "system_webhook" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "following" ADD "isFollowerHibernated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isHibernated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "hideOnlineStatus" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE INDEX "IDX_ce62b50d882d4e9dee10ad0d2f" ON "following" ("followeeId", "followerHost", "isFollowerHibernated") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_systemWebhookId" ON "abuse_report_notification_recipient" ("systemWebhookId") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_userId" ON "abuse_report_notification_recipient" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_method" ON "abuse_report_notification_recipient" ("method") `);
        await queryRunner.query(`CREATE INDEX "IDX_abuse_report_notification_recipient_isActive" ON "abuse_report_notification_recipient" ("isActive") `);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_userId2" FOREIGN KEY ("userId") REFERENCES "user_profile"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "abuse_report_notification_recipient" ADD CONSTRAINT "FK_abuse_report_notification_recipient_systemWebhookId" FOREIGN KEY ("systemWebhookId") REFERENCES "system_webhook"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
}
