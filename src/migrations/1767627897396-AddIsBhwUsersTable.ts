import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsBhwUsersTable1767627897396 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users ADD COLUMN is_bhw BOOLEAN DEFAULT FALSE`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users DROP COLUMN is_bhw`);
	}
}
