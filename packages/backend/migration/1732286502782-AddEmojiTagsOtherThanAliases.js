export default class AddEmojiTagsOtherThanAliases1732286502782 {
    name = 'AddEmojiTagsOtherThanAliases1732286502782'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "emoji" ADD "tags" character varying(128) array NOT NULL DEFAULT '{}'`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "emoji" DROP COLUMN "tags"`);
    }
}
