import {
	Entity,
	PrimaryColumn,
	Column,
	OneToMany,
	ManyToOne,
	JoinColumn,
	BeforeInsert,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
} from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { Service } from '../../services/entities/service.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('doctor_services')
export class DoctorServices {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'char', length: 36 })
	doctor_id: string;

	@OneToMany(() => Appointment, (appointment) => appointment.doctor_service)
	@JoinColumn({ name: 'id' })
	appointments: Appointment[];

	@ManyToOne(() => Doctor, (doctor) => doctor.doctor_services)
	@JoinColumn({ name: 'doctor_id' })
	doctor: Doctor;

	@Column({ type: 'char', length: 36 })
	service_id: string;

	@ManyToOne(() => Service, (service) => service.doctor_services)
	@JoinColumn({ name: 'service_id' })
	service: Service;

	@CreateDateColumn({ name: 'created_at' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt: Date;

	@DeleteDateColumn({ name: 'deleted_at' })
	deletedAt: Date;

	@BeforeInsert()
	private generateId() {
		if (!this.id) {
			this.id = uuidv4();
		}
	}
}
