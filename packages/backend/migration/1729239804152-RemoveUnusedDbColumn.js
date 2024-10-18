export class RemoveUnusedDbColumn1729239804152 {
    name = 'RemoveUnusedDbColumn1729239804152'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "clientData"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "room"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "room" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "clientData" jsonb NOT NULL DEFAULT '{}'`);
    }
}
