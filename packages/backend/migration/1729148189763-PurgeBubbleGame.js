export class PurgeBubbleGame1729148189763 {
    name = 'PurgeBubbleGame1729148189763'

    async up(queryRunner) {
        // BubbleGameRecord1704959805077
        await queryRunner.query(`ALTER TABLE "bubble_game_record" DROP CONSTRAINT "FK_75276757070d21fdfaf4c052909"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_26d4ee490b5a487142d35466ee"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4ae7053179014915d1432d3f40"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_75276757070d21fdfaf4c05290"`);
        await queryRunner.query(`DROP TABLE "bubble_game_record"`);
    }

    async down(queryRunner) {
        // BubbleGameRecord1704959805077
        await queryRunner.query(`CREATE TABLE "bubble_game_record" ("id" character varying(32) NOT NULL, "userId" character varying(32) NOT NULL, "seededAt" TIMESTAMP WITH TIME ZONE NOT NULL, "seed" character varying(1024) NOT NULL, "gameVersion" integer NOT NULL, "gameMode" character varying(128) NOT NULL, "score" integer NOT NULL, "logs" jsonb NOT NULL DEFAULT '[]', "isVerified" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a75395fe404b392e2893b50d7ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_75276757070d21fdfaf4c05290" ON "bubble_game_record" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4ae7053179014915d1432d3f40" ON "bubble_game_record" ("seededAt") `);
        await queryRunner.query(`CREATE INDEX "IDX_26d4ee490b5a487142d35466ee" ON "bubble_game_record" ("score") `);
        await queryRunner.query(`ALTER TABLE "bubble_game_record" ADD CONSTRAINT "FK_75276757070d21fdfaf4c052909" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
