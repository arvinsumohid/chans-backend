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

export class ChangeNameAppointmentsToEventsTable1764340143616 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('ALTER TABLE appointments RENAME TO events');
		await queryRunner.query('ALTER TABLE events RENAME COLUMN appointment_date TO event_date');
		await queryRunner.query(`ALTER TABLE events ADD COLUMN type varchar(36) NOT NULL DEFAULT 'appointment'`);
		await queryRunner.query(`UPDATE events SET type = 'appointment' WHERE type IS NULL OR type = '';`);

		const indexes: Index[] = (await queryRunner.query('SHOW INDEX FROM events')) as Index[];
		for (const index of indexes) {
			if (
				['idx_appointments_user_id', 'idx_appointments_doctor_service_id', 'idx_appointments_appointment_date'].includes(index.Key_name)
			) {
				await queryRunner.query(`DROP INDEX ${index.Key_name} ON events`);
			}
		}

		await queryRunner.query('CREATE INDEX idx_events_event_date ON events(event_date)');
		await queryRunner.query('CREATE INDEX idx_events_user_id ON events(user_id)');
		await queryRunner.query('CREATE INDEX idx_events_doctor_service_id ON events(doctor_service_id)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE events DROP COLUMN type`);
		await queryRunner.query('ALTER TABLE events RENAME TO appointments');
		await queryRunner.query('ALTER TABLE appointments RENAME COLUMN event_date TO appointment_date');

		const indexes: Index[] = (await queryRunner.query('SHOW INDEX FROM appointments')) as Index[];
		for (const index of indexes) {
			if (['idx_events_event_date', 'idx_events_user_id', 'idx_events_doctor_service_id'].includes(index.Key_name)) {
				await queryRunner.query(`DROP INDEX ${index.Key_name} ON appointments`);
			}
		}
		await queryRunner.query('CREATE INDEX idx_appointments_appointment_date ON appointments(appointment_date)');
		await queryRunner.query('CREATE INDEX idx_appointments_user_id ON appointments(user_id)');
		await queryRunner.query('CREATE INDEX idx_appointments_doctor_service_id ON appointments(doctor_service_id)');
	}
}
