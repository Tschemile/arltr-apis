import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateIndex1674142108462 implements MigrationInterface {
    name = 'UpdateIndex1674142108462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "file" ADD "url" character varying`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "UQ_51e2d4c72df88f28a560615379f" UNIQUE ("filename")`);
        await queryRunner.query(`CREATE INDEX "IDX_98522d97c4ecc30c636f5f5115" ON "course" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_067bc1af8daea88b10772b8749" ON "certificate" ("courseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3801ccf9533a8627c1dcb1e33b" ON "lesson" ("courseId") `);
        await queryRunner.query(`CREATE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `);
        await queryRunner.query(`CREATE INDEX "IDX_0dc7e58d73a1390874a663bd59" ON "blog" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2187c0133567e7247aed512b6" ON "reply" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9c66100bb6ac7d8711234ee4f1" ON "vote" ("blogId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d3240eaf64d34439513e46cb49" ON "group" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_1fee827e34a9a032a93cb9d56e" ON "member" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc0af80f2cf175db6d9fd93ec0" ON "resume" ("candidateId") `);
        await queryRunner.query(`CREATE INDEX "IDX_98da5dfa6c0a087f974800b93a" ON "applicant" ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c6fb082a3114f35d0cc27c518e" ON "post" ("authorId") `);
        await queryRunner.query(`CREATE INDEX "IDX_94a85bb16d24033a2afdd5df06" ON "comment" ("postId") `);
        await queryRunner.query(`CREATE INDEX "IDX_41697ba54bd2df09177c8bb4f6" ON "react" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_38dbd68ceaf6a55c56729dfa9e" ON "order" ("ticketId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8cfaf4a1e80806d58e3dbe6922" ON "product" ("slug") `);
        await queryRunner.query(`CREATE INDEX "IDX_950e218c17c81d5a9ffa1b9608" ON "item" ("orderId") `);
        await queryRunner.query(`CREATE INDEX "IDX_2a11d3c0ea1b2b5b1790f762b9" ON "review" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_230652e48daa99c50c000fc5d1" ON "report" ("categoryId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ab2c5c3c8aa73e846a40c6e6a0" ON "profile" ("domain") `);
        await queryRunner.query(`CREATE INDEX "IDX_d9b9688a8fef5afe193893d1d7" ON "relation" ("requesterId") `);
        await queryRunner.query(`CREATE INDEX "IDX_815bbf84cb5e82a56c85294d0f" ON "album" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_51e2d4c72df88f28a560615379" ON "file" ("filename") `);
        await queryRunner.query(`CREATE INDEX "IDX_d25f1ea79e282cc8a42bd616aa" ON "address" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_01cd2b829e0263917bf570cb67" ON "event" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_16a6241f329fdc4fd55168ab90" ON "responded" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_619bc7b78eba833d2044153bac" ON "message" ("chatId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aef269151248ce8ebee2ecf82d" ON "participant" ("chatId") `);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_0497171f776587bf42b759bb2c4" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_0497171f776587bf42b759bb2c4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_aef269151248ce8ebee2ecf82d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_619bc7b78eba833d2044153bac"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_16a6241f329fdc4fd55168ab90"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01cd2b829e0263917bf570cb67"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d25f1ea79e282cc8a42bd616aa"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51e2d4c72df88f28a560615379"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_815bbf84cb5e82a56c85294d0f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d9b9688a8fef5afe193893d1d7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab2c5c3c8aa73e846a40c6e6a0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_230652e48daa99c50c000fc5d1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2a11d3c0ea1b2b5b1790f762b9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_950e218c17c81d5a9ffa1b9608"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8cfaf4a1e80806d58e3dbe6922"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_38dbd68ceaf6a55c56729dfa9e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_41697ba54bd2df09177c8bb4f6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_94a85bb16d24033a2afdd5df06"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6fb082a3114f35d0cc27c518e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98da5dfa6c0a087f974800b93a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc0af80f2cf175db6d9fd93ec0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1fee827e34a9a032a93cb9d56e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d3240eaf64d34439513e46cb49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9c66100bb6ac7d8711234ee4f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2187c0133567e7247aed512b6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0dc7e58d73a1390874a663bd59"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3801ccf9533a8627c1dcb1e33b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_067bc1af8daea88b10772b8749"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_98522d97c4ecc30c636f5f5115"`);
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "UQ_51e2d4c72df88f28a560615379f"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "url"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "eventId"`);
    }

}
