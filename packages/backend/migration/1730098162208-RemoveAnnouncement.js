export class RemoveAnnouncement1730098162208 {
  name = 'RemoveAnnouncement1730098162208'

  async up(queryRunner) {
    // AnnouncementSilence1699141698112
    await queryRunner.query(`DROP INDEX "public"."IDX_7b8d9225168e962f94ea517e00"`);
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "silence"`);
    // DeleteCreatedAt1697420555911
    await queryRunner.query(`ALTER TABLE "announcement_read" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_118ec703e596086fc4515acb39" ON "announcement" ("createdAt") `);
    // RefineAnnouncement21691657412740
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "icon"`);
    // RefineAnnouncement1691649257651
		await queryRunner.query(`ALTER TABLE "announcement" DROP CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_fd25dfe3da37df1715f11ba6ec"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_da795d3a83187e8832005ba19d"`);
		await queryRunner.query(`DROP INDEX "public"."IDX_bc1afcc8ef7e9400cdc3c0a87e"`);
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "userId"`);
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "forExistingUsers"`);
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "isActive"`);
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "needConfirmationToRead"`);
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "display"`);
		// comments1605408971051
		await queryRunner.query(`COMMENT ON COLUMN "announcement_read"."createdAt" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "announcement"."updatedAt" IS NULL`);
		await queryRunner.query(`COMMENT ON COLUMN "announcement"."createdAt" IS NULL`);
		// v1231579282808087
		await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "updatedAt"`, undefined);
		// v1221579270193251
		await queryRunner.query(`ALTER TABLE "announcement_read" DROP COLUMN "createdAt"`, undefined);
		// v121579267006611
		await queryRunner.query(`ALTER TABLE "announcement_read" DROP CONSTRAINT "FK_603a7b1e7aa0533c6c88e9bfafe"`, undefined);
		await queryRunner.query(`ALTER TABLE "announcement_read" DROP CONSTRAINT "FK_8288151386172b8109f7239ab28"`, undefined);
		await queryRunner.query(`DROP TABLE "announcement_read"`, undefined);
		await queryRunner.query(`DROP TABLE "announcement"`, undefined);
  }

  async down(queryRunner) {
		// v121579267006611
		await queryRunner.query(`CREATE TABLE "announcement" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "text" character varying(8192) NOT NULL, "title" character varying(256) NOT NULL, "imageUrl" character varying(1024), CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`, undefined);
		await queryRunner.query(`CREATE INDEX "IDX_118ec703e596086fc4515acb39" ON "announcement" ("createdAt") `, undefined);
		await queryRunner.query(`CREATE TABLE "announcement_read" ("id" character varying(32) NOT NULL, "userId" character varying(32) NOT NULL, "announcementId" character varying(32) NOT NULL, CONSTRAINT "PK_4b90ad1f42681d97b2683890c5e" PRIMARY KEY ("id"))`, undefined);
		await queryRunner.query(`CREATE INDEX "IDX_8288151386172b8109f7239ab2" ON "announcement_read" ("userId") `, undefined);
		await queryRunner.query(`CREATE INDEX "IDX_603a7b1e7aa0533c6c88e9bfaf" ON "announcement_read" ("announcementId") `, undefined);
		await queryRunner.query(`CREATE UNIQUE INDEX "IDX_924fa71815cfa3941d003702a0" ON "announcement_read" ("userId", "announcementId") `, undefined);
		await queryRunner.query(`ALTER TABLE "announcement_read" ADD CONSTRAINT "FK_8288151386172b8109f7239ab28" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
		await queryRunner.query(`ALTER TABLE "announcement_read" ADD CONSTRAINT "FK_603a7b1e7aa0533c6c88e9bfafe" FOREIGN KEY ("announcementId") REFERENCES "announcement"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
		// v1221579270193251
		await queryRunner.query(`ALTER TABLE "announcement_read" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`, undefined);
		// v1231579282808087
		await queryRunner.query(`ALTER TABLE "announcement" ADD "updatedAt" TIMESTAMP WITH TIME ZONE`, undefined);
		// comments1605408971051
		await queryRunner.query(`COMMENT ON COLUMN "announcement"."createdAt" IS 'The created date of the Announcement.'`);
		await queryRunner.query(`COMMENT ON COLUMN "announcement"."updatedAt" IS 'The updated date of the Announcement.'`);
		await queryRunner.query(`COMMENT ON COLUMN "announcement_read"."createdAt" IS 'The created date of the AnnouncementRead.'`);
    // RefineAnnouncement1691649257651
    await queryRunner.query(`ALTER TABLE "announcement" ADD "display" character varying(256) NOT NULL DEFAULT 'normal'`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "needConfirmationToRead" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "isActive" boolean NOT NULL DEFAULT true`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "forExistingUsers" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "announcement" ADD "userId" character varying(32)`);
    await queryRunner.query(`CREATE INDEX "IDX_bc1afcc8ef7e9400cdc3c0a87e" ON "announcement" ("isActive") `);
    await queryRunner.query(`CREATE INDEX "IDX_da795d3a83187e8832005ba19d" ON "announcement" ("forExistingUsers") `);
    await queryRunner.query(`CREATE INDEX "IDX_fd25dfe3da37df1715f11ba6ec" ON "announcement" ("userId") `);
    await queryRunner.query(`ALTER TABLE "announcement" ADD CONSTRAINT "FK_fd25dfe3da37df1715f11ba6ec8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    // RefineAnnouncement21691657412740
    await queryRunner.query(`ALTER TABLE "announcement" ADD "icon" character varying(256) NOT NULL DEFAULT 'info'`);
    // DeleteCreatedAt1697420555911
    await queryRunner.query(`ALTER TABLE "announcement" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "announcement_read" DROP COLUMN "createdAt"`);
    // AnnouncementSilence1699141698112
    await queryRunner.query(`ALTER TABLE "announcement" ADD "silence" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`CREATE INDEX "IDX_7b8d9225168e962f94ea517e00" ON "announcement" ("silence") `);
  }
}
