import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueForUserNameAndEmailUserTable1763895792369 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users ADD CONSTRAINT UQ_username UNIQUE (username)`);
		await queryRunner.query(`ALTER TABLE users ADD CONSTRAINT UQ_email UNIQUE (email_address)`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE users DROP CONSTRAINT UQ_username`);
		await queryRunner.query(`ALTER TABLE users DROP CONSTRAINT UQ_email`);
	}
}
