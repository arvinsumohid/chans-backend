import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceTable1763485711015 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE services (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                is_active BOOLEAN NOT NULL DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT NULL
            )`,
		);
		await queryRunner.query('CREATE INDEX idx_services_name ON services(name)');
		await queryRunner.query('CREATE INDEX idx_services_is_active ON services(is_active)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_services_name ON services');
		await queryRunner.query('DROP INDEX idx_services_is_active ON services');
		await queryRunner.query(`DROP TABLE services`);
	}
}
