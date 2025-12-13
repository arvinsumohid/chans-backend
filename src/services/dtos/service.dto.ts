import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';
import { Service } from '../entities/service.entity';
import { DoctorServices } from '@/doctors/entities/doctor-service.entity';
import { Doctor } from '@/doctors/entities/doctor.entity';

export class ServiceDto {
	static mapToServiceEntities(doctors: ServiceRawDto[]): Service[] {
		const serviceRes: { [id: string]: Omit<Service, 'created_at' | 'deleted_at' | 'updated_at'> } = {};
		for (const d of doctors) {
			const doctorServices = serviceRes[d.id]?.doctor_services || [];
			serviceRes[d.id] = {
				...this.mapToServiceEntity(d),
				doctor_services: [...doctorServices, ...(this.mapToDoctorServiceEntity(d) ? [this.mapToDoctorServiceEntity(d)] : [])],
			};
		}
		return Object.values(serviceRes) as Service[];
	}

	static mapToServiceEntity(raw: ServiceRawDto): Service {
		const doctorRes = new Service();
		doctorRes.id = raw.id;
		doctorRes.name = raw.name;
		doctorRes.description = raw.description;
		doctorRes.is_active = raw.is_active;

		return doctorRes;
	}

	static mapToDoctorServiceEntity(raw: ServiceRawDto): DoctorServices {
		if (!raw.doctor_services_id) {
			return;
		}
		const doctorServices = new DoctorServices();
		doctorServices.id = raw.doctor_services_id;
		doctorServices.doctor_id = raw.doctor_services_doctor_id;
		doctorServices.service_id = raw.doctor_services_service_id;
		doctorServices.doctor = {
			id: raw.doctor_id,
			firstname: raw.doctor_firstname,
			middlename: raw.doctor_middlename,
			lastname: raw.doctor_lastname,
			description: raw.doctor_description,
			is_active: raw.doctor_is_active,
			created_at: raw.doctor_created_at,
			updated_at: raw.doctor_updated_at,
			deleted_at: raw.doctor_deleted_at,
		} as Doctor;
		return doctorServices;
	}
}
export class CreateServiceDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class ServiceRawDto {
	doctor_services_id?: string;
	doctor_services_doctor_id?: string;
	doctor_services_service_id?: string;
	doctor_services_created_at?: Date;
	doctor_services_updated_at?: Date;
	doctor_services_deleted_at?: Date;
	id?: string;
	name?: string;
	description?: string;
	is_active?: boolean;
	created_at?: Date;
	updated_at?: Date;
	deleted_at?: Date;
	doctor_id: string;
	doctor_firstname: string;
	doctor_middlename: string;
	doctor_lastname: string;
	doctor_description: string;
	doctor_is_active: boolean;
	doctor_created_at: Date;
	doctor_updated_at: Date;
	doctor_deleted_at: Date;
}
