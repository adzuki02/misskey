export class RemoveAbuseReport1730979145415 {
	name = 'RemoveAbuseReport1730979145415'

	async up(queryRunner) {
		// DeleteCreatedAt1697420555911
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
		await queryRunner.query(`CREATE INDEX "IDX_db2098070b2b5a523c58181f74" ON "abuse_user_report" ("createdAt") `);
		// fixforeignkeyreports1675053125067
		await queryRunner.query(`DROP INDEX "public"."IDX_a9021cc2e1feb5f72d3db6e9f5"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_a9021cc2e1feb5f72d3db6e9f5f"`);
		// foreignKeyReports1651224615271
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ALTER COLUMN "comment" SET DEFAULT '{}'`);
		// await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_a9021cc2e1feb5f72d3db6e9f5f"`);
		// forwardedReport1637320813000
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "forwarded"`);
		// comments1605408971051
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."reporterHost" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."targetUserHost" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."createdAt" IS NULL`);
		// refineAbuseUserReport21603095701770
		await queryRunner.query(`DROP INDEX "IDX_f8d8b93740ad12c4ce8213a199"`);
		await queryRunner.query(`DROP INDEX "IDX_4ebbf7f93cdc10e8d1ef2fc6cd"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "reporterHost"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "targetUserHost"`);
		// refineAbuseUserReport1603094348345
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_08b883dd5fdd6f9c4c1572b36de"`);
		await queryRunner.query(`DROP INDEX "IDX_2b15aaf4a0dc5be3499af7ab6a"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "comment"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "comment" character varying(512) NOT NULL DEFAULT '{}'::varchar[]`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "resolved"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "assigneeId"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" RENAME COLUMN "targetUserId" TO "userId"`);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5cd442c3b2e74fdd99dae20243" ON "abuse_user_report" ("userId", "reporterId") `);
		await queryRunner.query(`CREATE INDEX "IDX_d049123c413e68ca52abe73420" ON "abuse_user_report" ("userId") `);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_d049123c413e68ca52abe734203" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		// Init1000000000000
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_04cc96756f89d0b7f9473e8cdf3"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_d049123c413e68ca52abe734203"`);
		await queryRunner.query(`DROP TABLE "abuse_user_report"`);
	}

	async down(queryRunner) {
		// Init1000000000000
		await queryRunner.query(`CREATE TABLE "abuse_user_report" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, "reporterId" character varying(32) NOT NULL, "comment" character varying(512) NOT NULL, CONSTRAINT "PK_87873f5f5cc5c321a1306b2d18c" PRIMARY KEY ("id"))`);
		await queryRunner.query(`CREATE INDEX "IDX_db2098070b2b5a523c58181f74" ON "abuse_user_report" ("createdAt") `);
		await queryRunner.query(`CREATE INDEX "IDX_d049123c413e68ca52abe73420" ON "abuse_user_report" ("userId") `);
		await queryRunner.query(`CREATE INDEX "IDX_04cc96756f89d0b7f9473e8cdf" ON "abuse_user_report" ("reporterId") `);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_5cd442c3b2e74fdd99dae20243" ON "abuse_user_report" ("userId", "reporterId") `);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_d049123c413e68ca52abe734203" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_04cc96756f89d0b7f9473e8cdf3" FOREIGN KEY ("reporterId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		// refineAbuseUserReport1603094348345
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT "FK_d049123c413e68ca52abe734203"`);
		await queryRunner.query(`DROP INDEX "IDX_d049123c413e68ca52abe73420"`);
		await queryRunner.query(`DROP INDEX "IDX_5cd442c3b2e74fdd99dae20243"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" RENAME COLUMN "userId" TO "targetUserId"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "assigneeId" character varying(32)`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "resolved" boolean NOT NULL DEFAULT false`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "comment"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "comment" character varying(2048) NOT NULL DEFAULT '{}'::varchar[]`);
		await queryRunner.query(`CREATE INDEX "IDX_2b15aaf4a0dc5be3499af7ab6a" ON "abuse_user_report" ("resolved") `);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_08b883dd5fdd6f9c4c1572b36de" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
		// refineAbuseUserReport21603095701770
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "targetUserHost" character varying(128)`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "reporterHost" character varying(128)`);
		await queryRunner.query(`CREATE INDEX "IDX_4ebbf7f93cdc10e8d1ef2fc6cd" ON "abuse_user_report" ("targetUserHost") `);
		await queryRunner.query(`CREATE INDEX "IDX_f8d8b93740ad12c4ce8213a199" ON "abuse_user_report" ("reporterHost") `);
		// comments1605408971051
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."createdAt" IS 'The created date of the AbuseUserReport.'`);
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."targetUserHost" IS '[Denormalized]'`);
		await queryRunner.query(`COMMENT ON COLUMN "abuse_user_report"."reporterHost" IS '[Denormalized]'`);
		// forwardedReport1637320813000
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD "forwarded" boolean NOT NULL DEFAULT false`);
		// foreignKeyReports1651224615271
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ALTER COLUMN "comment" DROP DEFAULT`);
		// fixforeignkeyreports1675053125067
		await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_a9021cc2e1feb5f72d3db6e9f5" ON "abuse_user_report" ("targetUserId")`);
		await queryRunner.query(`DELETE FROM "abuse_user_report" WHERE "targetUserId" NOT IN (SELECT "id" FROM "user")`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP CONSTRAINT IF EXISTS "FK_a9021cc2e1feb5f72d3db6e9f5f"`);
		await queryRunner.query(`ALTER TABLE "abuse_user_report" ADD CONSTRAINT "FK_a9021cc2e1feb5f72d3db6e9f5f" FOREIGN KEY ("targetUserId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
		// DeleteCreatedAt1697420555911
		await queryRunner.query(`ALTER TABLE "abuse_user_report" DROP COLUMN "createdAt"`);
	}
}
