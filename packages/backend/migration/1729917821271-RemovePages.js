export class RemovePages1729917821271 {
    name = 'RemovePages1729917821271'

    async up(queryRunner) {
				// DeleteCreatedAt1697420555911
				await queryRunner.query(`ALTER TABLE "page_like" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
        await queryRunner.query(`ALTER TABLE "page" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
				// removeUnused1678427401214
        await queryRunner.query(`ALTER TABLE "meta" ADD "pinnedPages" character varying(512) array NOT NULL DEFAULT '{/featured,/channels,/explore,/pages,/about-misskey}'`);
				// foreignKeyReports1651224615271
				await queryRunner.query(`ALTER TABLE "page" RENAME CONSTRAINT "FK_a9ca79ad939bf06066b81c9d3aa" TO "FK_3126dd7c502c9e4d7597ef7ef10"`),
				// instancePinnedPages1605585339718
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "pinnedPages"`);
				// comments1605408971051
				await queryRunner.query(`COMMENT ON COLUMN "page"."userId" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "page"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "page"."createdAt" IS NULL`);
				// pageAiScript1586708940386
				await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "script"`, undefined);
				// PageTitleHideOption1562448332510
        await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "hideTitleWhenPinned"`);
				// PinnedPage1562444565093
				await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "FK_6dc44f1ceb65b1e72bacef2ca27"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP CONSTRAINT "UQ_6dc44f1ceb65b1e72bacef2ca27"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "pinnedPageId"`);
				// PageLike1558072954435
				await queryRunner.query(`ALTER TABLE "page_like" DROP CONSTRAINT "FK_cf8782626dced3176038176a847"`);
        await queryRunner.query(`ALTER TABLE "page_like" DROP CONSTRAINT "FK_0e61efab7f88dbb79c9166dbb48"`);
        await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "likedCount"`);
        await queryRunner.query(`DROP TABLE "page_like"`);
				// Pages1556348509290
				await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_3126dd7c502c9e4d7597ef7ef10"`);
        await queryRunner.query(`ALTER TABLE "page" DROP CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a"`);
        await queryRunner.query(`DROP TABLE "page"`);
        await queryRunner.query(`DROP TYPE "page_visibility_enum"`);
    }

    async down(queryRunner) {
				// Pages1556348509290
				await queryRunner.query(`CREATE TYPE "page_visibility_enum" AS ENUM('public', 'followers', 'specified')`);
        await queryRunner.query(`CREATE TABLE "page" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "title" character varying(256) NOT NULL, "name" character varying(256) NOT NULL, "summary" character varying(256), "alignCenter" boolean NOT NULL, "font" character varying(32) NOT NULL, "userId" character varying(32) NOT NULL, "eyeCatchingImageId" character varying(32), "content" jsonb NOT NULL DEFAULT '[]', "variables" jsonb NOT NULL DEFAULT '[]', "visibility" "page_visibility_enum" NOT NULL, "visibleUserIds" character varying(32) array NOT NULL DEFAULT '{}'::varchar[], CONSTRAINT "PK_742f4117e065c5b6ad21b37ba1f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fbb4297c927a9b85e9cefa2eb1" ON "page" ("createdAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_af639b066dfbca78b01a920f8a" ON "page" ("updatedAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_b82c19c08afb292de4600d99e4" ON "page" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_ae1d917992dd0c9d9bbdad06c4" ON "page" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_90148bbc2bf0854428786bfc15" ON "page" ("visibleUserIds") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2133ef8317e4bdb839c0dcbf13" ON "page" ("userId", "name") `);
        await queryRunner.query(`ALTER TABLE "page" ADD CONSTRAINT "FK_ae1d917992dd0c9d9bbdad06c4a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page" ADD CONSTRAINT "FK_3126dd7c502c9e4d7597ef7ef10" FOREIGN KEY ("eyeCatchingImageId") REFERENCES "drive_file"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
				// PageLike1558072954435
				await queryRunner.query(`CREATE TABLE "page_like" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, "pageId" character varying(32) NOT NULL, CONSTRAINT "PK_813f034843af992d3ae0f43c64c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0e61efab7f88dbb79c9166dbb4" ON "page_like" ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_4ce6fb9c70529b4c8ac46c9bfa" ON "page_like" ("userId", "pageId") `);
        await queryRunner.query(`ALTER TABLE "page" ADD "likedCount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "page_like" ADD CONSTRAINT "FK_0e61efab7f88dbb79c9166dbb48" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "page_like" ADD CONSTRAINT "FK_cf8782626dced3176038176a847" FOREIGN KEY ("pageId") REFERENCES "page"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
				// PinnedPage1562444565093
				await queryRunner.query(`ALTER TABLE "user_profile" ADD "pinnedPageId" character varying(32)`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "UQ_6dc44f1ceb65b1e72bacef2ca27" UNIQUE ("pinnedPageId")`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD CONSTRAINT "FK_6dc44f1ceb65b1e72bacef2ca27" FOREIGN KEY ("pinnedPageId") REFERENCES "page"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
				// PageTitleHideOption1562448332510
        await queryRunner.query(`ALTER TABLE "page" ADD "hideTitleWhenPinned" boolean NOT NULL DEFAULT false`);
				// pageAiScript1586708940386
        await queryRunner.query(`ALTER TABLE "page" ADD "script" character varying(16384) NOT NULL DEFAULT ''`, undefined);
				// comments1605408971051
				await queryRunner.query(`COMMENT ON COLUMN "page"."userId" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "page"."updatedAt" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "page"."createdAt" IS NULL`);
				// instancePinnedPages1605585339718
        await queryRunner.query(`ALTER TABLE "meta" ADD "pinnedPages" character varying(512) array NOT NULL DEFAULT '{"/featured", "/channels", "/explore", "/pages", "/about-misskey"}'::varchar[]`);
				// foreignKeyReports1651224615271
				await queryRunner.query(`ALTER TABLE "page" RENAME CONSTRAINT "FK_3126dd7c502c9e4d7597ef7ef10" TO "FK_a9ca79ad939bf06066b81c9d3aa"`);
				// removeUnused1678427401214
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "pinnedPages"`);
				// DeleteCreatedAt1697420555911
				await queryRunner.query(`ALTER TABLE "page" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "page_like" DROP COLUMN "createdAt"`);
    }
}
