import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventDateToTimeStamp1767772049277 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE events MODIFY COLUMN event_date TIMESTAMP NOT NULL`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE events MODIFY COLUMN event_date DATE NOT NULL`);
	}
}
