import { MigrationInterface, QueryRunner } from 'typeorm';

interface Index {
	Table: string;
	Non_unique: number;
	Key_name: string;
	Seq_in_index: number;
	Column_name: string;
	Collation: string;
	Cardinality: string;
	Sub_part: null;
	Packed: null;
	Null: string;
	Index_type: string;
	Comment: string;
	Index_comment: string;
	Visible: string;
	Expression: null;
}

export class UpdateAppointmentTable1763701832411 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const indexes: Index[] = (await queryRunner.query('SHOW INDEX FROM appointments')) as Index[];
		for (const index of indexes) {
			if (index.Key_name === 'idx_appointments_service_id' || index.Key_name === 'idx_appointments_doctor_id') {
				await queryRunner.query(`DROP INDEX ${index.Key_name} ON appointments`);
			}
		}
		await queryRunner.query(`ALTER TABLE appointments DROP COLUMN doctor_id`);
		await queryRunner.query(`ALTER TABLE appointments DROP COLUMN service_id`);
		await queryRunner.query(`ALTER TABLE appointments ADD doctor_services_id char(36) NOT NULL AFTER user_id`);
		await queryRunner.query(`ALTER TABLE appointments RENAME COLUMN doctor_services_id TO doctor_service_id`);
		await queryRunner.query('CREATE INDEX idx_appointments_doctor_service_id ON appointments(doctor_service_id)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const indexes: Index[] = (await queryRunner.query('SHOW INDEX FROM appointments')) as Index[];
		const indexNames = indexes.map((index) => index.Key_name);
		for (const index of indexes) {
			if (index.Key_name === 'idx_appointments_doctor_service_id') {
				await queryRunner.query('DROP INDEX idx_appointments_doctor_service_id ON appointments');
			}
		}

		await queryRunner.query(`ALTER TABLE appointments DROP COLUMN doctor_service_id`);
		await queryRunner.query(`ALTER TABLE appointments ADD doctor_id char(36) NOT NULL`);
		await queryRunner.query(`ALTER TABLE appointments ADD service_id char(36) NOT NULL`);

		if (!indexNames.includes('idx_appointments_service_id')) {
			await queryRunner.query('CREATE INDEX idx_appointments_service_id ON appointments(service_id)');
		}

		if (!indexNames.includes('idx_appointments_doctor_id')) {
			await queryRunner.query('CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id)');
		}
	}
}
