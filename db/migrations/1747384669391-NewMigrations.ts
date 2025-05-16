import { MigrationInterface, QueryRunner } from "typeorm";

export class NewMigrations1747384669391 implements MigrationInterface {
    name = 'NewMigrations1747384669391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "position" character varying NOT NULL, "managerId" integer, CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee" ADD CONSTRAINT "FK_f4a920dfa304e096fad40e8c4a0" FOREIGN KEY ("managerId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP CONSTRAINT "FK_f4a920dfa304e096fad40e8c4a0"`);
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
