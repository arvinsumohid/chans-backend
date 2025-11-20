import { Injectable, NotFoundException } from '@nestjs/common';
import { AppointmentRepository } from '../repositories/appointment.repository';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dtos/appointment.dto';
import { Appointment } from '../entities/appointment.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { ServiceRepository } from '@/services/repositories/service.repository';
import { DoctorRepository } from '@/doctors/repositories/doctor.repository';

@Injectable()
export class AppointmentService {
	constructor(
		private readonly appointmentRepository: AppointmentRepository,
		private readonly userRepository: UserRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly doctorRepository: DoctorRepository,
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

		console.log('appointment created', createAppointmentDto);
		const appointment = this.appointmentRepository.create({
			...createAppointmentDto,
			appointment_date: new Date(createAppointmentDto.appointment_date),
		});
		return this.appointmentRepository.save(appointment);
	}

	async findAll(): Promise<Appointment[]> {
		return this.appointmentRepository.find();
	}

	async findOne(id: string): Promise<Appointment> {
		const appointment = await this.appointmentRepository.findOne({ where: { id } });
		if (!appointment) {
			throw new NotFoundException('Appointment not found');
		}
		return appointment;
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
