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
import { DoctorServices } from '../../doctors/entities/doctor-service.entity';
import { User } from '@/users/entities/user.entity';

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
	doctor_service_id: string;

	@Column({ type: 'varchar', length: 36 })
	type: string;

	@ManyToOne(() => DoctorServices, (doctorServices) => doctorServices.events)
	@JoinColumn({ name: 'doctor_service_id' })
	doctor_service: DoctorServices;

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
