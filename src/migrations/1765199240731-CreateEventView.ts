import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEventView1765199240731 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE VIEW events_vw AS 
            SELECT 
                e.id AS event_id,
                e.entity_id AS entity_id,
                e.entity_type AS entity_type,
                e.event_date AS event_date,
                
                a.id AS announcement_id,
                a.name AS announcement_name,
                a.description AS announcement_description,
                
                d.id AS doctor_id,
                d.firstname AS doctor_firstname,
                d.middlename AS doctor_middlename,
                d.lastname AS doctor_lastname,
                d.description AS doctor_description,
                d.is_active AS doctor_is_active,
                
                s.id AS service_id,
                s.name AS service_name,
                s.description AS service_description,
                s.is_active AS service_is_active,

                u.id AS user_id,
                u.username AS user_username,
                u.firstname AS user_firstname,
                u.middlename AS user_middlename,
                u.lastname AS user_lastname,
                u.email_address AS user_email,
                u.birthdate AS user_birthdate,
                u.gender AS user_gender,
                u.is_active AS user_is_active

            FROM events e
            LEFT JOIN users u ON e.user_id = u.id
            LEFT JOIN announcements a ON a.id = e.entity_id AND e.entity_type = 'event'
            LEFT JOIN doctor_services ds ON ds.id = e.entity_id AND e.entity_type = 'appointment'
            LEFT JOIN doctors d ON d.id = ds.doctor_id
            LEFT JOIN services s ON s.id = ds.service_id
        `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP VIEW events_vw`);
	}
}
