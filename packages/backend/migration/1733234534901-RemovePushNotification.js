export default class RemovePushNotification1733234534901 {
    name = 'RemovePushNotification1733234534901'

    async up(queryRunner) {
				// meta
				await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableServiceWorker"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "swPublicKey"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "swPrivateKey"`);
				// DeleteCreatedAt1697420555911
        await queryRunner.query(`ALTER TABLE "sw_subscription" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL`);
				// whetherPushNotifyToSendReadMessage1669138716634
        await queryRunner.query(`ALTER TABLE "sw_subscription" DROP COLUMN "sendReadMessage"`);
				// Init1000000000000
        await queryRunner.query(`ALTER TABLE "sw_subscription" DROP CONSTRAINT "FK_97754ca6f2baff9b4abb7f853dd"`);
        await queryRunner.query(`DROP TABLE "sw_subscription"`);
    }

    async down(queryRunner) {
				// Init1000000000000
				await queryRunner.query(`CREATE TABLE "sw_subscription" ("id" character varying(32) NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "userId" character varying(32) NOT NULL, "endpoint" character varying(512) NOT NULL, "auth" character varying(256) NOT NULL, "publickey" character varying(128) NOT NULL, CONSTRAINT "PK_e8f763631530051b95eb6279b91" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97754ca6f2baff9b4abb7f853d" ON "sw_subscription" ("userId") `);
        await queryRunner.query(`ALTER TABLE "sw_subscription" ADD CONSTRAINT "FK_97754ca6f2baff9b4abb7f853dd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
				// whetherPushNotifyToSendReadMessage1669138716634
        await queryRunner.query(`ALTER TABLE "sw_subscription" ADD "sendReadMessage" boolean NOT NULL DEFAULT false`);
				// DeleteCreatedAt1697420555911
        await queryRunner.query(`ALTER TABLE "sw_subscription" DROP COLUMN "createdAt"`);
				// meta
				await queryRunner.query(`ALTER TABLE "meta" ADD "swPrivateKey" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "swPublicKey" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "enableServiceWorker" boolean NOT NULL DEFAULT false`);
    }
}
