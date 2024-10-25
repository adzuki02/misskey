export class RemoveLastActiveDateAndHibernated1729878772935 {
    name = 'RemoveLastActiveDateAndHibernated1729878772935'

    async up(queryRunner) {
        await queryRunner.query(`DROP INDEX "public"."IDX_ce62b50d882d4e9dee10ad0d2f"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastActiveDate"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isHibernated"`);
        await queryRunner.query(`ALTER TABLE "following" DROP COLUMN "isFollowerHibernated"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "following" ADD "isFollowerHibernated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isHibernated" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastActiveDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`CREATE INDEX "IDX_ce62b50d882d4e9dee10ad0d2f" ON "following" ("followeeId", "followerHost", "isFollowerHibernated") `);
    }
}
