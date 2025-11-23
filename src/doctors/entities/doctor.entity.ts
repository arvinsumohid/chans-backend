import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DoctorServices } from '../entities/doctor-service.entity';

@Entity('doctors')
export class Doctor {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'varchar', length: 100 })
	firstname: string;

	@Column({ type: 'varchar', length: 100 })
	middlename: string;

	@Column({ type: 'varchar', length: 100 })
	lastname: string;

	@Column({ type: 'text' })
	description: string;

	@Column({ type: 'boolean' })
	is_active: boolean;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;

	@OneToMany(() => DoctorServices, (doctorService) => doctorService.doctor)
	doctor_services: DoctorServices[];

	@BeforeInsert()
	private generateId() {
		if (!this.id) {
			this.id = uuidv4();
		}
	}
}
