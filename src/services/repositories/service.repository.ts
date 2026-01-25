import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { PaginationDto } from '@/common/common.dto';
import { ServiceDto, ServiceRawDto } from '../dtos/service.dto';

@Injectable()
export class ServiceRepository extends Repository<Service> {
	constructor(private dataSource: DataSource) {
		super(Service, dataSource.createEntityManager());
	}

	async findService(pagination: PaginationDto) {
		const { page = 1, size = 10, search } = pagination;
		const services = this.createQueryBuilder('services')
			.select('services.*')
			.leftJoinAndSelect('services.doctor_services', 'doctor_services')
			.leftJoinAndSelect('doctor_services.doctor', 'doctor');

		if (search) {
			if (!search.includes('::')) {
				services.where('services.name LIKE :search', { search: `%${search}%` });
			} else {
				const [searchType, searchValue] = search.split('::');
				if (searchType === 'name') {
					services.where('services.name LIKE :search', { search: `%${searchValue}%` });
				} else if (searchType === 'doctor') {
					services.where(
						`(
							doctor.firstname LIKE :search
							OR 
							doctor.lastname LIKE :search
						)`,
						{ search: `%${searchValue}%` },
					);
				} else if (searchType === 'all') {
					services.where(
						`(
							doctor.firstname LIKE :search
							OR 
							doctor.lastname LIKE :search
							OR 
							services.name LIKE :search
						)`,
						{ search: `%${searchValue}%` },
					);
				}
			}
		}

		const totalEvent = await services.getCount();

		services
			.skip((page - 1) * size)
			.take(size)
			.orderBy('services.name', 'ASC');

		const servicesRes: ServiceRawDto[] = await services.getRawMany();

		const servicesResMap = ServiceDto.mapToServiceEntities(servicesRes);

		return { items: servicesResMap, total_item: totalEvent, page, size };
	}
}
