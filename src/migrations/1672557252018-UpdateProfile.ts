import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfile1672557252018 implements MigrationInterface {
    name = 'UpdateProfile1672557252018'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "about" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "work" character varying`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "socialLinks" text`);
        await queryRunner.query(`ALTER TABLE "profile" ADD "hobbies" text`);
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "status" SET DEFAULT 'NONE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "status" SET DEFAULT 'ACTIVE'`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "hobbies"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "socialLinks"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "work"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "about"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "status" character varying NOT NULL DEFAULT 'ACTIVE'`);
    }

}
