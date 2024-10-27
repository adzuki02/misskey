export class RemoveNoteFavorite1730049483838 {
    name = 'RemoveNoteFavorite1730049483838'

    async up(queryRunner) {
			// DeleteCreatedAt1697420555911
			await queryRunner.query(`ALTER TABLE "note_favorite" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
			// comments1605408971051
			await queryRunner.query(`COMMENT ON COLUMN "note_favorite"."createdAt" IS NULL`);
			// Init1000000000000
			await queryRunner.query(`ALTER TABLE "note_favorite" DROP CONSTRAINT "FK_0e00498f180193423c992bc4370"`);
			await queryRunner.query(`ALTER TABLE "note_favorite" DROP CONSTRAINT "FK_47f4b1892f5d6ba8efb3057d81a"`);
			await queryRunner.query(`DROP TABLE "note_favorite"`);
    }

    async down(queryRunner) {
			// Init1000000000000
			await queryRunner.query(`CREATE TABLE "note_favorite" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, "noteId" character varying(32) NOT NULL, CONSTRAINT "PK_af0da35a60b9fa4463a62082b36" PRIMARY KEY ("id"))`);
			await queryRunner.query(`CREATE INDEX "IDX_47f4b1892f5d6ba8efb3057d81" ON "note_favorite" ("userId") `);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0f4fb9ad355f3effff221ef245" ON "note_favorite" ("userId", "noteId") `);
			await queryRunner.query(`ALTER TABLE "note_favorite" ADD CONSTRAINT "FK_47f4b1892f5d6ba8efb3057d81a" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
			await queryRunner.query(`ALTER TABLE "note_favorite" ADD CONSTRAINT "FK_0e00498f180193423c992bc4370" FOREIGN KEY ("noteId") REFERENCES "note"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
			// comments1605408971051
			await queryRunner.query(`COMMENT ON COLUMN "note_favorite"."createdAt" IS 'The created date of the NoteFavorite.'`);
			// DeleteCreatedAt1697420555911
			await queryRunner.query(`ALTER TABLE "note_favorite" DROP COLUMN "createdAt"`);
    }
}
