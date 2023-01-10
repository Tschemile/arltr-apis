import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1673275088811 implements MigrationInterface {
    name = 'UpdatePost1673275088811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "type" character varying NOT NULL DEFAULT 'POST'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "type"`);
    }

}
