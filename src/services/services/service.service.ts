import { Injectable } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto';
import { Service } from '../entities/service.entity';
import { NotFoundException } from '@nestjs/common';

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
		const service = await this.serviceRepository.findOne({ where: { id } });
		if (!service) {
			throw new NotFoundException(`Service not found`);
		}
		return service;
	}

	async findAll(): Promise<Service[]> {
		return this.serviceRepository.find();
	}
}
