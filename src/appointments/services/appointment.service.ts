import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dtos/appointment.dto';
import { Appointment } from '../entities/appointment.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { ServiceRepository } from '@/services/repositories/service.repository';
import { DoctorRepository } from '@/doctors/repositories/doctor.repository';
import { DoctorServiceRepository } from '@/doctors/repositories/doctor-service.repository';
import { Between } from 'typeorm';

@Injectable()
export class AppointmentService {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly userRepository: UserRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly doctorRepository: DoctorRepository,
		private readonly doctorServiceRepository: DoctorServiceRepository,
	) {}

	async createAppointment(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
		const user = await this.userRepository.findOne({ where: { id: createAppointmentDto.user_id } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		const service = await this.serviceRepository.findOne({ where: { id: createAppointmentDto.service_id } });
		if (!service) {
			throw new NotFoundException('Service not found');
		}

		const doctor = await this.doctorRepository.findOne({ where: { id: createAppointmentDto.doctor_id } });
		if (!doctor) {
			throw new NotFoundException('Doctor not found');
		}

		const doctorService = await this.doctorServiceRepository.findOne({
			where: {
				doctor_id: createAppointmentDto.doctor_id || '',
				service_id: createAppointmentDto.service_id || '',
			},
			select: ['id'],
		});
		if (!doctorService) {
			throw new NotFoundException('Doctor service not found');
		}

		const appointment = this.appointmentRepository.create({
			...createAppointmentDto,
			appointment_date: new Date(createAppointmentDto.appointment_date),
			doctor_service_id: doctorService.id,
		});
		return this.appointmentRepository.save(appointment);
	}

	async findAll(): Promise<Appointment[]> {
		return this.appointmentRepository.find();
	}

	async findOne(id: string): Promise<Appointment> {
		const appointment = await this.appointmentRepository.findOne({
			where: { id },
			relations: ['doctor_service.doctor', 'doctor_service.service'],
		});
		if (!appointment) {
			throw new NotFoundException('Appointment not found');
		}
		return appointment;
	}

	async findCalendar(userId: string, query: { from: string; to: string }): Promise<Appointment[]> {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user) {
			throw new NotFoundException('User not found');
		}

		return this.appointmentRepository.find({
			where: {
				user_id: userId,
				appointment_date: Between(new Date(query.from), new Date(query.to)),
			},
			relations: ['doctor_service.doctor', 'doctor_service.service'],
		});
	}

	async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
		const appointment = await this.appointmentRepository.findOne({ where: { id } });
		if (!appointment) {
			throw new NotFoundException('Appointment not found');
		}

		const updatedAppointment = this.appointmentRepository.create({
			...appointment,
			...updateAppointmentDto,
			id,
		});

		return this.appointmentRepository.save(updatedAppointment);
	}

	async delete(id: string): Promise<void> {
		const appointment = await this.appointmentRepository.findOne({ where: { id } });
		if (!appointment) {
			throw new NotFoundException('Appointment not found');
		}
		await this.appointmentRepository.delete(id);
	}
}
