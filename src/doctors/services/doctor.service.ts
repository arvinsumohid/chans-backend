import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorRepository } from '../repositories/doctor.repository';
import { CreateDoctorDto, UpdateDoctorDto } from '../dtos/doctor.dto';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class DoctorService {
	constructor(private doctorRepository: DoctorRepository) {}

	async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
		const doctor = this.doctorRepository.create({
			...createDoctorDto,
			is_active: createDoctorDto.is_active ?? true, // Default to true if not provided
		});
		return this.doctorRepository.save(doctor);
	}

	async update(id: string, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
		const doctor = await this.findOne(id);
		if (!doctor) {
			throw new NotFoundException(`Doctor not found`);
		}
		const updatedDoctor = this.doctorRepository.create({
			...doctor,
			...updateDoctorDto,
			id,
		});
		return this.doctorRepository.save(updatedDoctor);
	}

	async delete(id: string): Promise<void> {
		const doctor = await this.findOne(id);
		if (!doctor) {
			throw new NotFoundException(`Doctor not found`);
		}
		await this.doctorRepository.delete(id);
	}

	async findOne(id: string): Promise<Doctor> {
		const doctor = await this.doctorRepository.findOne({ where: { id } });
		if (!doctor) {
			throw new NotFoundException(`Doctor not found`);
		}
		return doctor;
	}

	async findAll(): Promise<Doctor[]> {
		return this.doctorRepository.find();
	}
}
