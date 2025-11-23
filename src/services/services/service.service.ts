import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto';
import { Service } from '../entities/service.entity';
import { ListResponsePaginationDto, PaginationDto } from '../../common/common.dto';
import { Like } from 'typeorm';

@Injectable()
export class ServiceService {
	constructor(private serviceRepository: ServiceRepository) {}

	async create(createServiceDto: CreateServiceDto): Promise<Service> {
		const service = this.serviceRepository.create({
			...createServiceDto,
			is_active: createServiceDto.is_active ?? true,
		});
		return this.serviceRepository.save(service);
	}

	async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
		const service = await this.serviceRepository.findOne({ where: { id } });
		if (!service) {
			throw new NotFoundException(`Service not found`);
		}
		const updatedService = this.serviceRepository.create({
			...service,
			...updateServiceDto,
			id,
		});
		return this.serviceRepository.save(updatedService);
	}

	async delete(id: string): Promise<void> {
		const service = await this.serviceRepository.findOne({ where: { id } });
		if (!service) {
			throw new NotFoundException(`Service not found`);
		}
		await this.serviceRepository.delete(id);
	}

	async findOne(id: string): Promise<Service> {
		const service = await this.serviceRepository.findOne({
			where: { id },
			relations: ['doctor_services', 'doctor_services.doctor'],
		});
		if (!service) {
			throw new NotFoundException(`Service not found`);
		}
		return service;
	}

	async findAll(paginationDto: PaginationDto): Promise<ListResponsePaginationDto<Service>> {
		const { page = 1, size = 10, search } = paginationDto;
		const whereClause = {};
		if (search) {
			whereClause['name'] = Like(`%${search}%`);
		}

		const services = await this.serviceRepository.find({
			where: whereClause,
			relations: ['doctor_services', 'doctor_services.doctor'],
			skip: (page - 1) * size,
			take: size,
			order: {
				name: 'ASC',
			},
		});

		const total = await this.serviceRepository.count({ where: whereClause });

		return { items: services, total_item: total, page, size };
	}
}
