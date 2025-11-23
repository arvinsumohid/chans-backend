import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorServiceTable1763630067898 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE doctor_services (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
                doctor_id CHAR(36) NOT NULL,
                service_id CHAR(36) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                deleted_at TIMESTAMP DEFAULT NULL
            )`,
		);
		await queryRunner.query('CREATE INDEX idx_doctor_services_doctor_id ON doctor_services(doctor_id)');
		await queryRunner.query('CREATE INDEX idx_doctor_services_service_id ON doctor_services(service_id)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_doctor_services_doctor_id ON doctor_services');
		await queryRunner.query('DROP INDEX idx_doctor_services_service_id ON doctor_services');
		await queryRunner.query(`DROP TABLE doctor_services`);
	}
}
