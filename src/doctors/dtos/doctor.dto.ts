import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Doctor } from '../entities/doctor.entity';
import { DoctorServices } from '../entities/doctor-service.entity';
import { Service } from '@/services/entities/service.entity';

export class DoctorDto {
	static mapToDoctorEntities(doctors: DoctorRawDto[]): Doctor[] {
		const doctorRes: { [id: string]: Omit<Doctor, 'created_at' | 'deleted_at' | 'updated_at'> } = {};
		for (const d of doctors) {
			const doctorServices = doctorRes[d.id]?.doctor_services || [];
			doctorRes[d.id] = {
				...this.mapToDoctorEntity(d),
				doctor_services: [...doctorServices, ...(this.mapToDoctorServiceEntity(d) ? [this.mapToDoctorServiceEntity(d)] : [])],
			};
		}
		return Object.values(doctorRes) as Doctor[];
	}

	static mapToDoctorEntity(raw: DoctorRawDto): Doctor {
		const doctorRes = new Doctor();
		doctorRes.id = raw.id;
		doctorRes.firstname = raw.firstname;
		doctorRes.middlename = raw.middlename;
		doctorRes.lastname = raw.lastname;
		doctorRes.description = raw.description;
		doctorRes.is_active = raw.is_active;

		return doctorRes;
	}

	static mapToDoctorServiceEntity(raw: DoctorRawDto): DoctorServices {
		if (!raw.doctor_services_id) {
			return;
		}
		const doctorServices = new DoctorServices();
		doctorServices.id = raw.doctor_services_id;
		doctorServices.doctor_id = raw.doctor_services_doctor_id;
		doctorServices.service_id = raw.doctor_services_service_id;
		doctorServices.service = {
			id: raw.service_id,
			name: raw.service_name,
			description: raw.service_description,
			is_active: raw.service_is_active,
			created_at: raw.service_created_at,
			updated_at: raw.service_updated_at,
			deleted_at: raw.service_deleted_at,
		} as Service;
		return doctorServices;
	}
}

export class CreateDoctorDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	firstname: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	middlename: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	lastname: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}

export class DoctorRawDto {
	doctor_services_id?: string;
	doctor_services_doctor_id?: string;
	doctor_services_service_id?: string;
	doctor_services_created_at?: Date;
	doctor_services_updated_at?: Date;
	doctor_services_deleted_at?: Date;
	service_id?: string;
	service_name?: string;
	service_description?: string;
	service_is_active?: boolean;
	service_created_at?: Date;
	service_updated_at?: Date;
	service_deleted_at?: Date;
	id: string;
	firstname: string;
	middlename: string;
	lastname: string;
	description: string;
	is_active: boolean;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}
