export class RemovePromoRead1729865192011 {
    name = 'RemovePromoRead1729865192011'

    async up(queryRunner) {
			// PromoRead
			await queryRunner.query(`ALTER TABLE "promo_read" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
			await queryRunner.query(`COMMENT ON COLUMN "promo_read"."createdAt" IS NULL`);
			await queryRunner.query(`ALTER TABLE "promo_read" DROP CONSTRAINT "FK_a46a1a603ecee695d7db26da5f4"`, undefined);
			await queryRunner.query(`ALTER TABLE "promo_read" DROP CONSTRAINT "FK_9657d55550c3d37bfafaf7d4b05"`, undefined);
			await queryRunner.query(`DROP TABLE "promo_read"`, undefined);
			// PromoNote
			await queryRunner.query(`ALTER TABLE "promo_note" DROP CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c"`);
			await queryRunner.query(`ALTER TABLE "promo_note" ADD CONSTRAINT "UQ_e263909ca4fe5d57f8d4230dd5c" UNIQUE ("noteId")`);
			await queryRunner.query(`ALTER TABLE "promo_note" ADD CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
			queryRunner.query(`ALTER TABLE "promo_note" DROP CONSTRAINT "UQ_e263909ca4fe5d57f8d4230dd5c"`),
			await queryRunner.query(`COMMENT ON COLUMN "promo_note"."userId" IS NULL`);
			await queryRunner.query(`COMMENT ON COLUMN "promo_note"."noteId" IS NULL`);
			await queryRunner.query(`ALTER TABLE "promo_note" DROP CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c"`, undefined);
			await queryRunner.query(`DROP TABLE "promo_note"`, undefined);
    }

    async down(queryRunner) {
			// PromoNote
			await queryRunner.query(`CREATE TABLE "promo_note" ("noteId" character varying(32) NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, CONSTRAINT "REL_e263909ca4fe5d57f8d4230dd5" UNIQUE ("noteId"), CONSTRAINT "PK_e263909ca4fe5d57f8d4230dd5c" PRIMARY KEY ("noteId"))`, undefined);
			await queryRunner.query(`CREATE INDEX "IDX_83f0862e9bae44af52ced7099e" ON "promo_note" ("userId") `, undefined);
			await queryRunner.query(`ALTER TABLE "promo_note" ADD CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
			await queryRunner.query(`COMMENT ON COLUMN "promo_note"."noteId" IS NULL`);
			await queryRunner.query(`COMMENT ON COLUMN "promo_note"."userId" IS '[Denormalized]'`);
			queryRunner.query(`ALTER TABLE "promo_note" ADD CONSTRAINT "UQ_e263909ca4fe5d57f8d4230dd5c" UNIQUE ("noteId")`),
			await queryRunner.query(`ALTER TABLE "promo_note" DROP CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c"`);
			await queryRunner.query(`ALTER TABLE "promo_note" DROP CONSTRAINT "UQ_e263909ca4fe5d57f8d4230dd5c"`);
			await queryRunner.query(`ALTER TABLE "promo_note" ADD CONSTRAINT "FK_e263909ca4fe5d57f8d4230dd5c" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
			// PromoRead
			await queryRunner.query(`CREATE TABLE "promo_read" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, "noteId" character varying(32) NOT NULL, CONSTRAINT "PK_61917c1541002422b703318b7c9" PRIMARY KEY ("id"))`, undefined);
			await queryRunner.query(`CREATE INDEX "IDX_9657d55550c3d37bfafaf7d4b0" ON "promo_read" ("userId") `, undefined);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_2882b8a1a07c7d281a98b6db16" ON "promo_read" ("userId", "noteId") `, undefined);
			await queryRunner.query(`ALTER TABLE "promo_read" ADD CONSTRAINT "FK_9657d55550c3d37bfafaf7d4b05" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
			await queryRunner.query(`ALTER TABLE "promo_read" ADD CONSTRAINT "FK_a46a1a603ecee695d7db26da5f4" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
			await queryRunner.query(`COMMENT ON COLUMN "promo_read"."createdAt" IS 'The created date of the PromoRead.'`);
			await queryRunner.query(`ALTER TABLE "promo_read" DROP COLUMN "createdAt"`);
    }
}
