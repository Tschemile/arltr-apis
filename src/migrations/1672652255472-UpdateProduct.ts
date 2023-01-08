import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProduct1672652255472 implements MigrationInterface {
    name = 'UpdateProduct1672652255472'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ADD CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP CONSTRAINT "UQ_8cfaf4a1e80806d58e3dbe69224"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slug"`);
    }

}
