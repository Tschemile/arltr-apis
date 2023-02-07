import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePost1675778095160 implements MigrationInterface {
    name = 'UpdatePost1675778095160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "disableComment" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "post" ADD "totalShares" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "post" ADD "linkedId" uuid`);
        await queryRunner.query(`ALTER TABLE "verify" ADD CONSTRAINT "UQ_241fdb3388701dd7c85bd3fab81" UNIQUE ("code")`);
        await queryRunner.query(`ALTER TABLE "post" ADD CONSTRAINT "FK_e949fb98f5fcfef1b63fd7b10eb" FOREIGN KEY ("linkedId") REFERENCES "post"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_e949fb98f5fcfef1b63fd7b10eb"`);
        await queryRunner.query(`ALTER TABLE "verify" DROP CONSTRAINT "UQ_241fdb3388701dd7c85bd3fab81"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "linkedId"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "totalShares"`);
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "disableComment"`);
    }

}
