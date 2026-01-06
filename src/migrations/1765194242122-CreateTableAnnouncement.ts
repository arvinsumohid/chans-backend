import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAnnouncement1765194242122 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE TABLE announcements (
            id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
            name VARCHAR(50) NOT NULL,
            description TEXT NOT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            deleted_at DATETIME
        )`);
		await queryRunner.query('CREATE INDEX idx_announcement_name ON announcements(name)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_announcement_name ON announcements');
		await queryRunner.query(`DROP TABLE announcements`);
	}
}
