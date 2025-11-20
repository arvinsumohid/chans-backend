import { In } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorServiceRepository } from '../repositories/doctor-service.repository';
import { DoctorRepository } from '../repositories/doctor.repository';
import { AddServiceViaDoctorDto } from '../dtos/doctor-service.dto';
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
		const serviceIds = addServiceViaDoctorDto.service_ids ? addServiceViaDoctorDto.service_ids.map((service_id) => service_id) : [];
		if (!doctorService) {
			throw new NotFoundException('Doctor not found');
		}

		const services = await this.serviceRepository.find({ where: { id: In(serviceIds) } });
		if (!services) {
			throw new NotFoundException('Service not found');
		}

		const doctorServices = addServiceViaDoctorDto.service_ids.map((service_id) => {
			return this.doctorServiceRepository.create({
				doctor_id,
				service_id,
			});
		});

		return this.doctorServiceRepository.save(doctorServices);
	}

	async getServicesByDoctor(doctor_id: string): Promise<DoctorServices[]> {
		const doctorServices = await this.doctorServiceRepository.find({
			where: { doctor_id },
			relations: ['service'],
		});
		return doctorServices;
	}

	async deleteServicesByDoctor(doctor_id: string, service_id: string): Promise<void> {
		const existing = await this.doctorServiceRepository.find({
			where: {
				doctor_id,
				service_id,
			},
		});

		if (existing.length === 0) {
			throw new NotFoundException('Doctor services not found');
		} else {
			await this.doctorServiceRepository.remove(existing);
		}
	}
}
