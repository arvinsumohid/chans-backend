import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { PaginationDto } from '@/common/common.dto';
import { UserDto, UserRawDto } from '../dtos/user.dto';

@Injectable()
export class UserRepository extends Repository<User> {
	constructor(private dataSource: DataSource) {
		super(User, dataSource.createEntityManager());
	}

	async findUsers(pagination: PaginationDto) {
		const { page = 1, size = 10, search } = pagination;
		const users = this.createQueryBuilder('users').select('users.*').leftJoinAndSelect('users.address', 'address');

		if (search) {
			if (!search.includes('::')) {
				users.where(
					`(
						users.firstname LIKE :search
						OR 
						users.lastname LIKE :search
					)`,
					{ search: `%${search}%` },
				);
			} else {
				const [searchType, searchValue] = search.split('::');
				if (searchType === 'name') {
					users.where(
						`(
							users.firstname LIKE :search
							OR 
							users.lastname LIKE :search
						)`,
						{ search: `%${searchValue}%` },
					);
				} else if (searchType === 'barangay') {
					users.where('address.barangay LIKE :search', { search: `%${searchValue}%` });
				}
			}
		}

		// users.andWhere('users.role = :role', { role: Role.USER });

		const totalEvent = await users.getCount();

		users
			.skip((page - 1) * size)
			.take(size)
			.orderBy('users.lastname', 'ASC');

		const usersRes: UserRawDto[] = await users.getRawMany();

		const usersResMap = UserDto.mapToUserEntities(usersRes);

		return { items: usersResMap, total_item: totalEvent, page, size };
	}
}
