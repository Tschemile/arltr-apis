import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProfile1672841432021 implements MigrationInterface {
    name = 'UpdateProfile1672841432021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "profile" ADD CONSTRAINT "FK_3881afc104de5307431139a7129" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_3881afc104de5307431139a7129"`);
        await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "categoryId"`);
    }

}
