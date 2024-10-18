export class RepealAchievements1729212275236 {
    name = 'RepealAchievements1729212275236';

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "achievements"`);
        await queryRunner.query(`UPDATE "user_profile" SET "notificationRecieveConfig" = "notificationRecieveConfig" - 'achievementEarned'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "achievements" jsonb NOT NULL DEFAULT '[]'`);
    }
}
