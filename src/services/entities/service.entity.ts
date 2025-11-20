import { Entity, PrimaryColumn, Column, BeforeInsert, OneToMany } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { DoctorServices } from '../../doctors/entities/doctor-service.entity';

@Entity('services')
export class Service {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'varchar', length: 100 })
	name: string;

	@Column({ type: 'text' })
	description: string;
	@Column({ type: 'boolean' })
	is_active: boolean;

	@Column({ type: 'timestamp' })
	created_at: Date;

	@Column({ type: 'timestamp' })
	updated_at: Date;

	@Column({ type: 'timestamp' })
	deleted_at: Date;

	@OneToMany(() => DoctorServices, (doctorService) => doctorService.service)
	doctor_services: DoctorServices[];

	@BeforeInsert()
	private generateId() {
		if (!this.id) {
			this.id = uuidv4();
		}
	}
}
