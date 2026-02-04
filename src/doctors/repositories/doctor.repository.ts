import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import { PaginationDto } from '@/common/common.dto';
import { DoctorDto, DoctorRawDto } from '../dtos/doctor.dto';

@Injectable()
export class DoctorRepository extends Repository<Doctor> {
	constructor(private dataSource: DataSource) {
		super(Doctor, dataSource.createEntityManager());
	}

	async findDoctors(pagination: PaginationDto) {
		const { page = 1, size = 10, search } = pagination;
		const doctors = this.createQueryBuilder('doctors')
			.select('doctors.*')
			.leftJoinAndSelect('doctors.doctor_services', 'doctor_services')
			.leftJoinAndSelect('doctor_services.service', 'service');

		if (search) {
			if (!search.includes('::')) {
				doctors.where(
					`(
                        doctors.firstname LIKE :search
                        OR 
                        doctors.lastname LIKE :search
                    )`,
					{ search: `%${search}%` },
				);
			} else {
				const [searchType, searchValue] = search.split('::');
				if (searchType === 'name') {
					doctors.where(
						`(
							doctors.firstname LIKE :search
							OR 
							doctors.lastname LIKE :search
						)`,
						{ search: `%${searchValue}%` },
					);
				} else if (searchType === 'service') {
					doctors.where('service.name LIKE :search', { search: `%${searchValue}%` });
				} else if (searchType === 'all') {
					doctors.where(
						`(
							doctors.firstname LIKE :search
							OR 
							doctors.lastname LIKE :search
							OR 
							service.name LIKE :search
						)`,
						{ search: `%${searchValue}%` },
					);
				}
			}
		}

		const totalEvent = await doctors.getCount();

		doctors
			.offset((page - 1) * size)
			.limit(size)
			.orderBy('doctors.lastname', 'ASC');

		const doctorsRes: DoctorRawDto[] = await doctors.getRawMany();

		const doctorsResMap = DoctorDto.mapToDoctorEntities(doctorsRes);

		return { items: doctorsResMap, total_item: totalEvent, page, size };
	}
}
