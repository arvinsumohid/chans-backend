import { In, IsNull } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorServiceRepository } from '../repositories/doctor-service.repository';
import { DoctorRepository } from '../repositories/doctor.repository';
import { AddDoctorViaServiceDto, AddServiceViaDoctorDto } from '../dtos/doctor-service.dto';
import { DoctorServices } from '../entities/doctor-service.entity';
import { ServiceRepository } from '../../services/repositories/service.repository';

@Injectable()
export class DoctorServiceService {
	constructor(
		private readonly doctorServiceRepository: DoctorServiceRepository,
		private readonly doctorRepository: DoctorRepository,
		private readonly serviceRepository: ServiceRepository,
	) {}

	async addServicesByDoctor(doctor_id: string, addServiceViaDoctorDto: AddServiceViaDoctorDto): Promise<DoctorServices[]> {
		const doctorService = await this.doctorRepository.findOne({ where: { id: doctor_id } });
		const selectedServiceIds = addServiceViaDoctorDto.selected_service_ids
			? addServiceViaDoctorDto.selected_service_ids.map((service_id) => service_id)
			: [];
		const unselectedServiceIds = addServiceViaDoctorDto.unselected_service_ids
			? addServiceViaDoctorDto.unselected_service_ids.map((service_id) => service_id)
			: [];
		if (!doctorService) {
			throw new NotFoundException('Doctor not found');
		}

		const selectedServices = await this.doctorServiceRepository.find({
			where: { doctor_id, service_id: In(selectedServiceIds), deletedAt: IsNull() },
			select: ['id'],
		});

		const selectedServiceIdsNotExisted = selectedServiceIds.filter((service_id) => {
			return !selectedServices.some((selectedService) => selectedService.service_id === service_id);
		});

		const doctorServices = selectedServiceIdsNotExisted.map((service_id) => {
			return this.doctorServiceRepository.create({
				doctor_id,
				service_id,
			});
		});

		const savedDoctorServices = await this.doctorServiceRepository.save(doctorServices);

		const unselectedServices = await this.doctorServiceRepository.find({
			where: { doctor_id, service_id: In(unselectedServiceIds), deletedAt: IsNull() },
			select: ['id'],
		});

		await Promise.all(
			unselectedServices.map(async (service) => {
				await this.doctorServiceRepository.softDelete(service.id);
			}),
		);

		return savedDoctorServices;
	}

	async addDoctorsByService(service_id: string, addDoctorViaServiceDto: AddDoctorViaServiceDto): Promise<DoctorServices[]> {
		const doctorService = await this.serviceRepository.findOne({ where: { id: service_id } });
		const selectedDoctorIds = addDoctorViaServiceDto.selected_doctor_ids
			? addDoctorViaServiceDto.selected_doctor_ids.map((doctor_id) => doctor_id)
			: [];
		const unselectedDoctorIds = addDoctorViaServiceDto.unselected_doctor_ids
			? addDoctorViaServiceDto.unselected_doctor_ids.map((doctor_id) => doctor_id)
			: [];
		if (!doctorService) {
			throw new NotFoundException('Doctor not found');
		}

		const selectedDoctors = await this.doctorServiceRepository.find({
			where: { service_id, doctor_id: In(selectedDoctorIds), deletedAt: IsNull() },
			select: ['id'],
		});

		const selectedDoctorIdsNotExisted = selectedDoctorIds.filter((doctor_id) => {
			return !selectedDoctors.some((selectedDoctor) => selectedDoctor.doctor_id === doctor_id);
		});

		const doctorServices = selectedDoctorIdsNotExisted.map((doctor_id) => {
			return this.doctorServiceRepository.create({
				doctor_id,
				service_id,
			});
		});

		const savedDoctorServices = await this.doctorServiceRepository.save(doctorServices);

		const unselectedDoctors = await this.doctorServiceRepository.find({
			where: { service_id, doctor_id: In(unselectedDoctorIds), deletedAt: IsNull() },
			select: ['id'],
		});

		await Promise.all(
			unselectedDoctors.map(async (doctor) => {
				await this.doctorServiceRepository.softDelete(doctor.id);
			}),
		);

		return savedDoctorServices;
	}

	async getServicesByDoctor(doctor_id: string): Promise<DoctorServices[]> {
		const doctorServices = await this.doctorServiceRepository.find({
			where: { doctor_id },
			relations: ['service'],
		});
		return doctorServices;
	}

	async getDoctorsByService(service_id: string): Promise<DoctorServices[]> {
		const doctorServices = await this.doctorServiceRepository.find({
			where: { service_id },
			relations: ['doctor'],
		});
		return doctorServices;
	}

	async deleteServicesByDoctor(doctor_id: string, service_id: string): Promise<void> {
		const existing = await this.doctorServiceRepository.findOne({
			where: {
				doctor_id,
				service_id,
				deletedAt: IsNull(),
			},
		});

		if (!existing) {
			throw new NotFoundException('Doctor services not found');
		} else {
			await this.doctorServiceRepository.softDelete(existing.id);
		}
	}
}
