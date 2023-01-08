import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateMember1673092837337 implements MigrationInterface {
    name = 'UpdateMember1673092837337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "archived" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member" ALTER COLUMN "archived" SET NOT NULL`);
    }

}
