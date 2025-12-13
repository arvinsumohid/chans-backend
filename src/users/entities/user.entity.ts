import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToOne } from 'typeorm';
import { Address } from '@/addresses/entities/address.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
	@PrimaryColumn({ type: 'char', length: 36 })
	id: string;
	@Column({ type: 'varchar', length: 100 })
	username: string;

	@OneToOne(() => Address, (address) => address.user)
	address: Address;

	@Column({ type: 'varchar', length: 255 })
	password: string;

	@Column({ type: 'varchar', length: 100 })
	firstname: string;

	@Column({ type: 'varchar', length: 100 })
	middlename: string;

	@Column({ type: 'varchar', length: 100 })
	lastname: string;

	@Column({ type: 'varchar', length: 100 })
	email_address: string;

	@Column({ type: 'date' })
	birthdate: Date;

	@Column({ type: 'varchar', length: 50 })
	gender: string;

	@Column({ type: 'date' })
	last_login_at: Date;

	@Column()
	phone_number: string;

	@Column({ type: 'text' })
	description: string;

	@Column({ type: 'varchar', length: 50 })
	role: string;

	@Column({ type: 'boolean' })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;

	@BeforeInsert()
	private generateId() {
		if (!this.id) {
			this.id = uuidv4();
		}
	}
}
