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
			.leftJoin('services.doctor_services', 'doctor_services')
			.leftJoin('doctor_services.doctor', 'doctor');

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

		const totalCountResult = await services.clone().select('COUNT(DISTINCT services.id)', 'total').getRawOne<{ total: string }>();
		const totalEvent = Number(totalCountResult?.total ?? 0);

		const pagedServiceIds = await services
			.clone()
			.select('services.id', 'id')
			.addSelect('services.name', 'name')
			.distinct(true)
			.orderBy('services.name', 'ASC')
			.addOrderBy('services.id', 'ASC')
			.offset((page - 1) * size)
			.limit(size)
			.getRawMany<{ id: string; name: string }>();

		const serviceIds = pagedServiceIds.map((row) => row.id);
		if (!serviceIds.length) {
			return { items: [], total_item: totalEvent, page, size };
		}

		const serviceRowsQuery = this.createQueryBuilder('services')
			.select('services.*')
			.leftJoinAndSelect('services.doctor_services', 'doctor_services')
			.leftJoinAndSelect('doctor_services.doctor', 'doctor')
			.where('services.id IN (:...serviceIds)', { serviceIds })
			.orderBy('services.name', 'ASC')
			.addOrderBy('services.id', 'ASC');

		const servicesRes: ServiceRawDto[] = await serviceRowsQuery.getRawMany();

		const servicesResMap = ServiceDto.mapToServiceEntities(servicesRes);

		return { items: servicesResMap, total_item: totalEvent, page, size };
	}
}
