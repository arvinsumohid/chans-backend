import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAddressesTable1763482998204 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE addresses (
                id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
				user_id VARCHAR(255) NOT NULL,
				region VARCHAR(255) NOT NULL,
				province VARCHAR(255) NOT NULL,
				city VARCHAR(255) NOT NULL,
				barangay VARCHAR(255) NOT NULL,
				address_line VARCHAR(255) NOT NULL,
				postal_code VARCHAR(255) NOT NULL,
				country VARCHAR(255) DEFAULT 'Philippines',
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
				updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
				deleted_at TIMESTAMP DEFAULT NULL
			)`,
		);
		await queryRunner.query('CREATE INDEX idx_addresses_user_id ON addresses(user_id)');
		await queryRunner.query('CREATE INDEX idx_addresses_region ON addresses(region)');
		await queryRunner.query('CREATE INDEX idx_addresses_province ON addresses(province)');
		await queryRunner.query('CREATE INDEX idx_addresses_city ON addresses(city)');
		await queryRunner.query('CREATE INDEX idx_addresses_barangay ON addresses(barangay)');
		await queryRunner.query('CREATE INDEX idx_addresses_address_line ON addresses(address_line)');
		await queryRunner.query('CREATE INDEX idx_addresses_postal_code ON addresses(postal_code)');
		await queryRunner.query('CREATE INDEX idx_addresses_country ON addresses(country)');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX idx_addresses_user_id ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_region ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_province ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_city ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_barangay ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_address_line ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_postal_code ON addresses');
		await queryRunner.query('DROP INDEX idx_addresses_country ON addresses');
		await queryRunner.query(`DROP TABLE addresses`);
	}
}
