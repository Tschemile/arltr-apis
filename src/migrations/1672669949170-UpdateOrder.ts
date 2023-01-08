import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder1672669949170 implements MigrationInterface {
    name = 'UpdateOrder1672669949170'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "isPaid" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paidAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "isDelivered" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveredAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "receipt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "receipt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "deliveredAt"`);
        await queryRunner.query(`ALTER TABLE "order" ADD "deliveredAt" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "isDelivered" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "paidAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "order" ALTER COLUMN "isPaid" DROP DEFAULT`);
    }

}
