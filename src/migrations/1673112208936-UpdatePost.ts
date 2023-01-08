import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1673112208936 implements MigrationInterface {
    name = 'UpdatePost1673112208936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "totalReacts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "post" ADD "totalComments" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "comment" ADD "totalReacts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "images" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "video" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "mode" SET DEFAULT 'PUBLIC'`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "content" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "image" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "image" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "mode" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "video" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "images" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "content" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "totalReacts"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "totalComments"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "totalReacts"`);
    }

}
