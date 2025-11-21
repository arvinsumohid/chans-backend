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

@Entity('appointments')
export class Appointment {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'varchar', length: 36 })
	user_id: string;

	@Column({ type: 'varchar', length: 36 })
	doctor_service_id: string;

	@ManyToOne(() => DoctorServices, (doctorServices) => doctorServices.appointments)
	@JoinColumn({ name: 'doctor_service_id' })
	doctor_service: DoctorServices;

	@Column({ type: 'date' })
	appointment_date: Date;

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
