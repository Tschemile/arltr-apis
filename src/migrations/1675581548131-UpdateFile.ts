import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateFile1675581548131 implements MigrationInterface {
    name = 'UpdateFile1675581548131'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" ADD "albumId" uuid`);
        await queryRunner.query(`ALTER TABLE "file" ADD CONSTRAINT "FK_98ae013e715e51390fe94254798" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "file" DROP CONSTRAINT "FK_98ae013e715e51390fe94254798"`);
        await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "albumId"`);
    }

}
