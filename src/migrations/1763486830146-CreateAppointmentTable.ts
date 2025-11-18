import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAppointmentTable1763486830146 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE appointments (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
                user_id CHAR(36) NOT NULL,
                service_id CHAR(36) NOT NULL,
                doctor_id CHAR(36) NOT NULL,
                appointment_date date NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT now(),
                updated_at TIMESTAMP NOT NULL DEFAULT now(),
                deleted_at TIMESTAMP
            )`,
		);
		await queryRunner.query('CREATE INDEX idx_appointments_user_id ON appointments(user_id)');
		await queryRunner.query('CREATE INDEX idx_appointments_service_id ON appointments(service_id)');
		await queryRunner.query('CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id)');
		await queryRunner.query('CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_appointments_user_id ON appointments');
		await queryRunner.query('DROP INDEX idx_appointments_service_id ON appointments');
		await queryRunner.query('DROP INDEX idx_appointments_doctor_id ON appointments');
		await queryRunner.query('DROP INDEX idx_appointments_appointment_date ON appointments');
		await queryRunner.query(`DROP TABLE appointments`);
	}
}
