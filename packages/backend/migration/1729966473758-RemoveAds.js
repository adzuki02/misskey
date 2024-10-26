export class RemoveAds1729966473758 {
    name = 'RemoveAds1729966473758'

    async up(queryRunner) {
				// automatic generation
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "notesPerOneAd"`);
				// DeleteCreatedAt1697420555911
        await queryRunner.query(`ALTER TABLE "ad" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_1129c2ef687fc272df040bafaa" ON "ad" ("createdAt") `);
				// Fix1690417561187
        await queryRunner.query(`COMMENT ON COLUMN "ad"."startsAt" IS NULL`);
				// ad1677054292210
				await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "dayOfWeek"`);
				// ad1676438468213
				await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "startsAt"`);
				// ad21620364649428
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "ratio"`);
				// ad1620019354680
				await queryRunner.query(`DROP INDEX "IDX_2da24ce20ad209f1d9dc032457"`);
        await queryRunner.query(`DROP INDEX "IDX_1129c2ef687fc272df040bafaa"`);
        await queryRunner.query(`DROP TABLE "ad"`);
    }

    async down(queryRunner) {
				// ad1620019354680
				await queryRunner.query(`CREATE TABLE "ad" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "place" character varying(32) NOT NULL, "priority" character varying(32) NOT NULL, "url" character varying(1024) NOT NULL, "imageUrl" character varying(1024) NOT NULL, "memo" character varying(8192) NOT NULL, CONSTRAINT "PK_0193d5ef09746e88e9ea92c634d" PRIMARY KEY ("id")); COMMENT ON COLUMN "ad"."createdAt" IS 'The created date of the Ad.'; COMMENT ON COLUMN "ad"."expiresAt" IS 'The expired date of the Ad.'`);
				await queryRunner.query(`CREATE INDEX "IDX_1129c2ef687fc272df040bafaa" ON "ad" ("createdAt") `);
				await queryRunner.query(`CREATE INDEX "IDX_2da24ce20ad209f1d9dc032457" ON "ad" ("expiresAt") `);
				// ad21620364649428
        await queryRunner.query(`ALTER TABLE "ad" ADD "ratio" integer NOT NULL DEFAULT '1'`);
				// ad1676438468213
				await queryRunner.query(`ALTER TABLE "ad" ADD "startsAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
				// ad1677054292210
				await queryRunner.query(`ALTER TABLE "ad" ADD "dayOfWeek" integer NOT NULL Default 0`);
				// DeleteCreatedAt1697420555911
        await queryRunner.query(`ALTER TABLE "ad" DROP COLUMN "createdAt"`);
				// automatic generation
        await queryRunner.query(`ALTER TABLE "meta" ADD "notesPerOneAd" integer NOT NULL DEFAULT '0'`);
    }
}
