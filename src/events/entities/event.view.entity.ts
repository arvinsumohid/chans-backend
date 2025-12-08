import { Gender } from '@/users/enum/user.enum';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('events_vw')
export class EventView {
	@PrimaryColumn()
	event_id: string;

	@PrimaryColumn()
	entity_id: string;

	@Column()
	entity_type: string;

	@Column()
	event_date: Date;

	@Column()
	announcement_id: string;

	@Column()
	announcement_name: string;

	@Column()
	announcement_description: string;

	@PrimaryColumn()
	doctor_id: string;

	@Column()
	doctor_firstname: string;

	@Column()
	doctor_middlename: string;

	@Column()
	doctor_lastname: string;

	@Column()
	doctor_description: string;

	@Column()
	doctor_is_active: boolean;

	@PrimaryColumn()
	service_id: string;

	@Column()
	service_name: string;

	@Column()
	service_description: string;

	@Column()
	service_is_active: boolean;

	@Column()
	user_id: string;

	@Column()
	user_firstname: string;

	@Column()
	user_middlename: string;

	@Column()
	user_lastname: string;

	@Column()
	user_email: string;

	@Column()
	user_gender: Gender;

	@Column()
	user_is_active: boolean;
}
