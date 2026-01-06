import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserTable1765646492038 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users ADD COLUMN last_login_at DATE DEFAULT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users DROP COLUMN last_login_at`);
	}
}
