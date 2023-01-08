import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfile1672584073261 implements MigrationInterface {
    name = 'UpdateProfile1672584073261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "domain" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "UQ_ab2c5c3c8aa73e846a40c6e6a06" UNIQUE ("domain")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "UQ_ab2c5c3c8aa73e846a40c6e6a06"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "domain"`);
    }

}
