import { User } from '@/users/entities/user.entity';
import {
	Entity,
	PrimaryColumn,
	Column,
	BeforeInsert,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('addresses')
export class Address {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'char', length: 36 })
	user_id: string;

	@OneToOne(() => User, (user) => user.address)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ type: 'varchar', length: 100 })
	region: string;

	@Column({ type: 'varchar', length: 100 })
	province: string;

	@Column({ type: 'varchar', length: 100 })
	city: string;

	@Column({ type: 'varchar', length: 100 })
	barangay: string;

	@Column({ type: 'varchar', length: 255 })
	address_line: string;

	@Column({ type: 'varchar', length: 10 })
	postal_code: string;

	@Column({ type: 'varchar', length: 100 })
	country: string;

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
