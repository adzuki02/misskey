export class RemoveActiveUsersChart1729857475620 {
    name = 'RemoveActiveUsersChart1729857475620'

    async up(queryRunner) {
			//#region __chart__active_users
			// chartV141644344266289
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___write"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___write"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___read"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___read"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___readWrite"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___notedUsers" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___notedUsers" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___users" character varying array NOT NULL DEFAULT '{}'`);
			// chartV111644095659741
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredOutsideYear"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredOutsideYear"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredOutsideMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredOutsideMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredOutsideWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredOutsideWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredWithinYear"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredWithinYear"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredWithinMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredWithinMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___registeredWithinWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___registeredWithinWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___remote_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___local_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___remote_users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___local_users" integer NOT NULL DEFAULT '0'`);
			// chartV81644059847460
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___local_users" TYPE bigint USING "___local_users"::bigint`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___remote_users" TYPE bigint USING "___remote_users"::bigint`);
			// chartV51643966656277
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___local_users"`);
			// chartV41643963705770
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___remote_users" character varying array NOT NULL DEFAULT '{}'::varchar[]`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___local_users" character varying array NOT NULL DEFAULT '{}'::varchar[]`);
			// chartV31639325650583
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___remote_users" SET DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___local_users" SET DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP CONSTRAINT "UQ_0ad37b7ef50f4ddc84363d7ccca"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "group" character varying(128)`);
			// chartReindex1629004542760
			// chartV221615966519402
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___local_users"`);
			// chartV21615965918224
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___remote_count" bigint NOT NULL DEFAULT 0`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___local_count" bigint NOT NULL DEFAULT 0`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique" jsonb NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`CREATE TYPE "public"."__chart__active_users_span_enum" AS ENUM('hour', 'day')`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "span" "__chart__active_users_span_enum" NOT NULL DEFAULT 'hour'`);
			// ChartIndexes1561873850023
			// Init1000000000000
			await queryRunner.query(`DROP TABLE "__chart__active_users"`);
			await queryRunner.query(`DROP TYPE "__chart__active_users_span_enum"`);
			//#endregion

			//#region __chart_day__active_users
			// tweakVarcharLength1678426061773
			// chartV141644344266289
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___write"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___write"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___read"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___read"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___readWrite"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___notedUsers" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___notedUsers" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___users" character varying array NOT NULL DEFAULT '{}'`);
			// chartV111644095659741
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredOutsideYear"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredOutsideYear"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredOutsideMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredOutsideMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredOutsideWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredOutsideWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredWithinYear"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredWithinYear"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredWithinMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredWithinMonth"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___registeredWithinWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___registeredWithinWeek"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___remote_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___local_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___remote_users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___local_users" integer NOT NULL DEFAULT '0'`);
			// chartV81644059847460
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___local_users" TYPE bigint USING "___local_users"::bigint`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___remote_users" TYPE bigint USING "___remote_users"::bigint`);
			// chartV51643966656277
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___local_users"`);
			// chartV41643963705770
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___remote_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___local_users" character varying array NOT NULL DEFAULT '{}'`);
			// chartV31639325650583
			await queryRunner.query(`DROP TABLE "__chart_day__active_users"`);
			//#endregion
    }

    async down(queryRunner) {
			//#region __chart__active_users
			// Init1000000000000
			await queryRunner.query(`CREATE TYPE "__chart__active_users_span_enum" AS ENUM('hour', 'day')`);
			await queryRunner.query(`CREATE TABLE "__chart__active_users" ("id" SERIAL NOT NULL, "date" integer NOT NULL, "group" character varying(128), "span" "__chart__active_users_span_enum" NOT NULL, "unique" jsonb NOT NULL DEFAULT '{}', "___local_count" bigint NOT NULL, "___remote_count" bigint NOT NULL, CONSTRAINT "PK_317237a9f733b970604a11e314f" PRIMARY KEY ("id"))`);
			// ChartIndexes1561873850023
			// await queryRunner.query(`CREATE INDEX "IDX_0ad37b7ef50f4ddc84363d7ccc" ON "__chart__active_users" ("date") `);
			await queryRunner.query(`CREATE INDEX "IDX_15e91a03aeeac9dbccdf43fc06" ON "__chart__active_users" ("span") `);
			await queryRunner.query(`CREATE INDEX "IDX_00ed5f86db1f7efafb1978bf21" ON "__chart__active_users" ("group") `);
			await queryRunner.query(`CREATE INDEX "IDX_20f57cc8f142c131340ee16742" ON "__chart__active_users" ("span", "date") `);
			// await queryRunner.query(`CREATE INDEX "IDX_9a3ed15a30ab7e3a37702e6e08" ON "__chart__active_users" ("date", "group") `);
			await queryRunner.query(`CREATE INDEX "IDX_c26e2c1cbb6e911e0554b27416" ON "__chart__active_users" ("span", "date", "group") `);
			// chartV21615965918224
			await queryRunner.query(`DELETE FROM "__chart__active_users" WHERE "span" = 'day'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "span"`);
			await queryRunner.query(`DROP TYPE "public"."__chart__active_users_span_enum"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___local_count"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___remote_count"`);
			// chartV221615966519402
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___local_users" character varying array NOT NULL DEFAULT '{}'::varchar[]`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___remote_users" character varying array NOT NULL DEFAULT '{}'::varchar[]`);
			// chartReindex1629004542760
			await queryRunner.query(`DELETE FROM "__chart__active_users" a USING "__chart__active_users" b WHERE a.id < b.id AND ((a.group IS NULL AND b.group IS NULL) OR a.group = b.group) AND a.date = b.date;`);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_9a3ed15a30ab7e3a37702e6e08" ON "__chart__active_users" ("date", "group") `);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_60c5c6e7e538c09aa274ecd1cf" ON "__chart__active_users" ("date") WHERE "group" IS NULL`);
			// chartV31639325650583
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "group"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD CONSTRAINT "UQ_0ad37b7ef50f4ddc84363d7ccca" UNIQUE ("date")`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___local_users" DROP DEFAULT`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___remote_users" DROP DEFAULT`);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0ad37b7ef50f4ddc84363d7ccc" ON "__chart__active_users" ("date") `);
			// chartV41643963705770
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___local_users" bigint NOT NULL DEFAULT 0`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___remote_users" bigint NOT NULL DEFAULT 0`);
			// chartV51643966656277
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___local_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___remote_users" character varying array NOT NULL DEFAULT '{}'`);
			// chartV81644059847460
			await queryRunner.query(`UPDATE "__chart__active_users" SET "___local_users"=2147483647 WHERE "___local_users" > 2147483647`);
			await queryRunner.query(`UPDATE "__chart__active_users" SET "___remote_users"=2147483647 WHERE "___remote_users" > 2147483647`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___local_users" TYPE integer USING "___local_users"::integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___remote_users" TYPE integer USING "___remote_users"::integer`);
			// chartV111644095659741
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___notedUsers" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___notedUsers" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredWithinWeek" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredWithinWeek" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredWithinMonth" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredWithinMonth" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredWithinYear" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredWithinYear" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredOutsideWeek" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredOutsideWeek" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredOutsideMonth" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredOutsideMonth" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___registeredOutsideYear" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___registeredOutsideYear" smallint NOT NULL DEFAULT '0'`);
			// chartV141644344266289
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___users"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "unique_temp___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" DROP COLUMN "___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___readWrite" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___read" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___read" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "unique_temp___write" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ADD "___write" smallint NOT NULL DEFAULT '0'`);
			// tweakVarcharLength1678426061773
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___readWrite" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___read" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___write" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredWithinWeek" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredWithinMonth" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredWithinYear" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredOutsideWeek" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredOutsideMonth" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart__active_users" ALTER COLUMN "___registeredOutsideYear" TYPE integer`);
			//#endregion

			//#region __chart_day__active_users
			await queryRunner.query(`CREATE TABLE "__chart_day__active_users" ("id" SERIAL NOT NULL, "date" integer NOT NULL, "___local_users" character varying array NOT NULL, "___remote_users" character varying array NOT NULL, CONSTRAINT "UQ_d5954f3df5e5e3bdfc3c03f3906" UNIQUE ("date"), CONSTRAINT "PK_b1790489b14f005ae8f404f5795" PRIMARY KEY ("id"))`);
			await queryRunner.query(`CREATE UNIQUE INDEX "IDX_d5954f3df5e5e3bdfc3c03f390" ON "__chart_day__active_users" ("date") `);
			// chartV41643963705770
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___local_users" bigint NOT NULL DEFAULT 0`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___remote_users" bigint NOT NULL DEFAULT 0`);
			// chartV51643966656277
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___local_users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___remote_users" character varying array NOT NULL DEFAULT '{}'`);
			// chartV81644059847460
			await queryRunner.query(`UPDATE "__chart_day__active_users" SET "___local_users"=2147483647 WHERE "___local_users" > 2147483647`);
			await queryRunner.query(`UPDATE "__chart_day__active_users" SET "___remote_users"=2147483647 WHERE "___remote_users" > 2147483647`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___local_users" TYPE integer USING "___local_users"::integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___remote_users" TYPE integer USING "___remote_users"::integer`);
			// chartV111644095659741
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___local_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___remote_users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___users" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___users" integer NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___notedUsers" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___notedUsers" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredWithinWeek" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredWithinWeek" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredWithinMonth" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredWithinMonth" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredWithinYear" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredWithinYear" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredOutsideWeek" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredOutsideWeek" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredOutsideMonth" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredOutsideMonth" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___registeredOutsideYear" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___registeredOutsideYear" smallint NOT NULL DEFAULT '0'`);
			// chartV141644344266289
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___users"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "unique_temp___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" DROP COLUMN "___notedUsers"`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___readWrite" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___read" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___read" smallint NOT NULL DEFAULT '0'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "unique_temp___write" character varying array NOT NULL DEFAULT '{}'`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ADD "___write" smallint NOT NULL DEFAULT '0'`);
			// tweakVarcharLength1678426061773
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___readWrite" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___read" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___write" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredWithinWeek" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredWithinMonth" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredWithinYear" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredOutsideWeek" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredOutsideMonth" TYPE integer`);
			await queryRunner.query(`ALTER TABLE "__chart_day__active_users" ALTER COLUMN "___registeredOutsideYear" TYPE integer`);
			//#endregion
    }
}
