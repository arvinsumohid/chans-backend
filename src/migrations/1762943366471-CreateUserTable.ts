import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1762943366471 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE users (
            id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
            username VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            firstname VARCHAR(100) NOT NULL,
            middlename VARCHAR(100),
            lastname VARCHAR(100) NOT NULL,
            email_address VARCHAR(100) NOT NULL,
            birthdate DATE NOT NULL,
            gender ENUM('male', 'female', 'other') NOT NULL,
            phone_number VARCHAR(100),
            description TEXT,
            role VARCHAR(100) NOT NULL,
            is_active BOOLEAN NOT NULL DEFAULT true,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at DATETIME
        )`);
		await queryRunner.query('CREATE INDEX idx_users_username ON users(username)');
		await queryRunner.query('CREATE INDEX idx_users_firstname ON users(firstname)');
		await queryRunner.query('CREATE INDEX idx_users_lastname ON users(lastname)');
		await queryRunner.query('CREATE INDEX idx_users_email_address ON users(email_address)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_users_username ON users');
		await queryRunner.query('DROP INDEX idx_users_firstname ON users');
		await queryRunner.query('DROP INDEX idx_users_lastname ON users');
		await queryRunner.query('DROP INDEX idx_users_email_address ON users');
		await queryRunner.query(`DROP TABLE users`);
	}
}
