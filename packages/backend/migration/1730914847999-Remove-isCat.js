export class RemoveIsCat1730914847999 {
    name = 'RemoveIsCat1730914847999'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isCat"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user" ADD "isCat" boolean NOT NULL DEFAULT false`);
    }
}
