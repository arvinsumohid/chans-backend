import { Injectable, NotFoundException } from '@nestjs/common';
import { DoctorRepository } from '../repositories/doctor.repository';
import { CreateDoctorDto, UpdateDoctorDto } from '../dtos/doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import { ListResponsePaginationDto, PaginationDto } from '../../common/common.dto';
import { Like } from 'typeorm';

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
		const doctor = await this.doctorRepository.findOne({
			where: { id },
			relations: ['doctor_services', 'doctor_services.service'],
		});
		if (!doctor) {
			throw new NotFoundException(`Doctor not found`);
		}
		return doctor;
	}

	async findAll(paginationDto: PaginationDto): Promise<ListResponsePaginationDto<Doctor>> {
		const { page = 1, size = 10, search } = paginationDto;
		const whereClause = {};
		if (search) {
			whereClause['firstname'] = Like(`%${search}%`);
			whereClause['lastname'] = Like(`%${search}%`);
			whereClause['middlename'] = Like(`%${search}%`);
		}

		const doctors = await this.doctorRepository.find({
			where: whereClause,
			relations: ['doctor_services', 'doctor_services.service'],
			select: {
				id: true,
				firstname: true,
				lastname: true,
				middlename: true,
				description: true,
				is_active: true,
				doctor_services: true,
			},
			skip: (page - 1) * size,
			take: size,
			order: {
				lastname: 'ASC',
			},
		});

		const total = await this.doctorRepository.count({ where: whereClause });

		return { items: doctors, total_item: total, page, size };
	}
}
