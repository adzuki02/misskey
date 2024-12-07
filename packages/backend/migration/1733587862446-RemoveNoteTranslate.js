export default class RemoveNoteTranslate1733587862446 {
    name = 'RemoveNoteTranslate1733587862446'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "deeplAuthKey"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "deeplIsPro"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "deeplIsPro" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "deeplAuthKey" character varying(1024)`);
    }
}
