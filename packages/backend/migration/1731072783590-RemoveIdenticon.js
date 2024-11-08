export class RemoveIdenticon1731072783590 {
    name = 'RemoveIdenticon1731072783590'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableChartsForRemoteUser"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableIdenticonGeneration"`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "enableIdenticonGeneration" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "enableChartsForRemoteUser" boolean NOT NULL DEFAULT true`);
    }
}
