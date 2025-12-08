import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	BeforeInsert,
	ManyToOne,
	JoinColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/users/entities/user.entity';

/**
 * Note: entity_id and entity_type are used to store the id and type of the entity, it is called polymorphic relationship
 */
@Entity('events')
export class Event {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'varchar', length: 36 })
	user_id: string;

	@ManyToOne(() => User, (user) => user.id)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@Column({ type: 'varchar', length: 36 })
	entity_id: string;

	@Column({ type: 'varchar', length: 36 })
	entity_type: string;

	@Column({ type: 'date' })
	event_date: Date;

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
