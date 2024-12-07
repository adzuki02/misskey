export default class RemoveAvatarDecorations1733585002559 {
    name = 'RemoveAvatarDecorations1733585002559'

    async up(queryRunner) {
				// AvatarDecoration21697941908548
				await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarDecorations"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarDecorations" character varying(512) array NOT NULL DEFAULT '{}'`);

				// AvatarDecoration1697847397844
				await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarDecorations"`);
        await queryRunner.query(`DROP TABLE "avatar_decoration"`);
    }

    async down(queryRunner) {
				// AvatarDecoration1697847397844
				await queryRunner.query(`CREATE TABLE "avatar_decoration" ("id" character varying(32) NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE, "url" character varying(1024) NOT NULL, "name" character varying(256) NOT NULL, "description" character varying(2048) NOT NULL, "roleIdsThatCanBeUsedThisDecoration" character varying(128) array NOT NULL DEFAULT '{}', CONSTRAINT "PK_b6de9296f6097078e1dc53f7603" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarDecorations" character varying(512) array NOT NULL DEFAULT '{}'`);

				// AvatarDecoration21697941908548
				await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarDecorations"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarDecorations" jsonb NOT NULL DEFAULT '[]'`);
    }
}
