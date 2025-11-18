import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
	@PrimaryColumn({ type: 'char', length: 36, default: () => 'UUID()' })
	id: string;

	@Column({ type: 'varchar', length: 36 })
	user_id: string;

	@Column({ type: 'varchar', length: 36 })
	service_id: string;

	@Column({ type: 'varchar', length: 36 })
	doctor_id: string;

	@Column({ type: 'date' })
	appointment_date: Date;

	@CreateDateColumn()
	created_at: Date;

	@UpdateDateColumn()
	updated_at: Date;

	@DeleteDateColumn()
	deleted_at: Date;
}
