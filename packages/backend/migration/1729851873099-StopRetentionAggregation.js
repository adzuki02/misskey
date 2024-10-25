export default class StopRetentionAggregation1729851873099 {
    name = 'StopRetentionAggregation1729851873099'

    async up(queryRunner) {
        // retentionDateKey1678869617549
        await queryRunner.query(`DROP INDEX "public"."IDX_f7c3576b37bd2eec966ae24477"`);
        await queryRunner.query(`ALTER TABLE "retention_aggregation" DROP COLUMN "dateKey"`);
        // RetentionAggregation21671926422832
        await queryRunner.query(`ALTER TABLE "retention_aggregation" DROP COLUMN "usersCount"`);
        await queryRunner.query(`COMMENT ON COLUMN "retention_aggregation"."updatedAt" IS 'The updated date of the GalleryPost.'`);
        await queryRunner.query(`ALTER TABLE "retention_aggregation" DROP COLUMN "updatedAt"`);
        // RetentionAggregation1671924750884
        await queryRunner.query(`DROP INDEX "public"."IDX_09f4e5b9e4a2f268d3e284e4b3"`);
        await queryRunner.query(`DROP TABLE "retention_aggregation"`);
    }

    async down(queryRunner) {
        // RetentionAggregation1671924750884
        await queryRunner.query(`CREATE TABLE "retention_aggregation" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userIds" character varying(32) array NOT NULL, "data" jsonb NOT NULL DEFAULT '{}', CONSTRAINT "PK_22aad3e8640b15fb3b90ee02d18" PRIMARY KEY ("id")); COMMENT ON COLUMN "retention_aggregation"."createdAt" IS 'The created date of the Note.'`);
        await queryRunner.query(`CREATE INDEX "IDX_09f4e5b9e4a2f268d3e284e4b3" ON "retention_aggregation" ("createdAt") `);
        // RetentionAggregation21671926422832
        await queryRunner.query(`ALTER TABLE "retention_aggregation" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "retention_aggregation"."updatedAt" IS 'The updated date of the GalleryPost.'`);
        await queryRunner.query(`ALTER TABLE "retention_aggregation" ADD "usersCount" integer NOT NULL`);
        // retentionDateKey1678869617549
        await queryRunner.query(`TRUNCATE TABLE "retention_aggregation"`, undefined);
        await queryRunner.query(`ALTER TABLE "retention_aggregation" ADD "dateKey" character varying(512) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_f7c3576b37bd2eec966ae24477" ON "retention_aggregation" ("dateKey") `);
    }
}
