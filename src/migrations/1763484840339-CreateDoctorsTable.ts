import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorsTable1763484840339 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE doctors (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
                firstname VARCHAR(255) NOT NULL,
                middlename VARCHAR(255) NOT NULL,
                lastname VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT NULL
            )`,
		);
		await queryRunner.query('CREATE INDEX idx_doctors_firstname ON doctors(firstname)');
		await queryRunner.query('CREATE INDEX idx_doctors_middlename ON doctors(middlename)');
		await queryRunner.query('CREATE INDEX idx_doctors_lastname ON doctors(lastname)');
		await queryRunner.query('CREATE INDEX idx_doctors_is_active ON doctors(is_active)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_doctors_firstname ON doctors');
		await queryRunner.query('DROP INDEX idx_doctors_middlename ON doctors');
		await queryRunner.query('DROP INDEX idx_doctors_lastname ON doctors');
		await queryRunner.query('DROP INDEX idx_doctors_is_active ON doctors');
		await queryRunner.query(`DROP TABLE doctors`);
	}
}
