export class StopAggregateLoggedInDates1729241492362 {
    name = 'StopAggregateLoggedInDates1729241492362'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "loggedInDates"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "loggedInDates" character varying(32) array NOT NULL DEFAULT '{}'`);
    }
}
