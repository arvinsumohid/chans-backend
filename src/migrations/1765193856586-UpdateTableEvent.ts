import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTableEvent1765193856586 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE events RENAME COLUMN doctor_service_id TO entity_id`);
		await queryRunner.query(`ALTER TABLE events RENAME COLUMN type TO entity_type`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE events RENAME COLUMN entity_id TO doctor_service_id`);
		await queryRunner.query(`ALTER TABLE events RENAME COLUMN entity_type TO type`);
	}
}
