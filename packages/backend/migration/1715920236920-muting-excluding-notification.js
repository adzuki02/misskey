export class MutingExcludingNotification1715920236920 {
    name = 'MutingExcludingNotification1715920236920'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "muting" ADD "excludeNotification" boolean NOT NULL DEFAULT false`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "muting" DROP COLUMN "excludeNotification"`);
    }
}
