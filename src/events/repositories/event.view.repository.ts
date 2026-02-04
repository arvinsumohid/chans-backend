import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { EventView } from '../entities/event.view.entity';
import { ListResponsePaginationDto } from '@/common/common.dto';
import { EventListDto, QueryCalendarDto } from '../dtos/event.dto';
import { User } from '@/users/entities/user.entity';
import { EventType, Role } from '@/users/enum/user.enum';
import dayjs from '@/utils/dayjs-config.util';

@Injectable()
export class EventViewRepository extends Repository<EventView> {
	constructor(private dataSource: DataSource) {
		super(EventView, dataSource.createEntityManager());
	}

	async findEvents(user: User, query: EventListDto): Promise<ListResponsePaginationDto<EventView>> {
		const { page = 1, size = 10, type, search, from, to } = query;
		const { role, id } = user;
		const event = this.createQueryBuilder('events_vw').select('events_vw.*');
		let totalEvent = 0;

		if (type && type !== 'all') {
			event.andWhere('events_vw.entity_type = :entity_type', { entity_type: type });

			if (search && search.includes('::')) {
				const [searchType, searchValue] = search.split('::');

				if (type === (EventType.APPOINTMENT as string)) {
					if (['user', 'doctor'].includes(searchType)) {
						event.andWhere(
							`(
								events_vw.${searchType}_firstname LIKE :search
								OR 
								events_vw.${searchType}_lastname LIKE :search
							)`,
							{ search: `%${searchValue}%` },
						);
					} else if (searchType === 'all') {
						event.andWhere(
							`(
								events_vw.user_firstname LIKE :search
								OR 
								events_vw.user_lastname LIKE :search
								OR 
								events_vw.doctor_firstname LIKE :search
								OR 
								events_vw.doctor_lastname LIKE :search
								OR 
								events_vw.service_name LIKE :search
							)`,
							{ search: `%${searchValue}%` },
						);
					} else {
						event.andWhere(`events_vw.${searchType} LIKE :search`, { search: `%${searchValue}%` });
					}
				} else if (type === (EventType.EVENT as string)) {
					if (searchType === 'all') {
						event.andWhere(`events_vw.announcement_name LIKE :search`, { search: `%${searchValue}%` });
					} else {
						event.andWhere(`events_vw.${searchType} LIKE :search`, { search: `%${searchValue}%` });
					}
				}
			}

			const phFrom = from ? dayjs(from).tz('Asia/Manila').startOf('day').format('YYYY-MM-DD') : null;
			const phTo = to ? dayjs(to).tz('Asia/Manila').endOf('day').format('YYYY-MM-DD') : null;

			if (from && to) {
				event.andWhere('events_vw.event_date >= :from', { from: phFrom });
				event.andWhere('events_vw.event_date <= :to', { to: phTo });
			}

			// user get own appointment, if not admin
			if (type === (EventType.APPOINTMENT as string) && role !== (Role.ADMIN as string)) {
				event.andWhere('events_vw.user_id = :user_id', { user_id: id });
			}
		} else {
			if (role !== (Role.ADMIN as string)) {
				event.andWhere(
					`(
                        events_vw.entity_type = :event
                        OR 
                        (events_vw.entity_type = :appointment AND events_vw.user_id = :uid)
                    )`,
					{ event: EventType.EVENT, appointment: EventType.APPOINTMENT, uid: user.id },
				);
			} else {
				// for admin
				event.andWhere('events_vw.entity_type IN (:...entity_type)', { entity_type: ['event', 'appointment'] });
			}
		}

		if (!from && !to) {
			const date = dayjs().tz('Asia/Manila').startOf('day').format('YYYY-MM-DD');
			event.andWhere('events_vw.event_date >= :event_date', { event_date: date }).orderBy('events_vw.event_date', 'ASC');
		}

		// get total event
		totalEvent = await event.getCount();

		event.offset((page - 1) * size).limit(size);

		const eventRes: EventView[] = await event.getRawMany();

		const eventsWithPHDate = eventRes.map((ev) => ({
			...ev,
			event_date: dayjs(ev.event_date).tz('Asia/Manila').toDate(),
		}));

		return {
			items: eventsWithPHDate,
			total_item: totalEvent,
			page,
			size,
		};
	}

	async findEventsCalendar(user: User, query: QueryCalendarDto): Promise<EventView[]> {
		const event = this.createQueryBuilder('events_vw').select('events_vw.*');

		// for type is event or appointment
		if (query.type !== 'all') {
			event
				.andWhere('events_vw.event_date >= :start', { start: dayjs(query.from).tz('Asia/Manila').startOf('day').toDate() })
				.andWhere('events_vw.event_date <= :end', { end: dayjs(query.to).tz('Asia/Manila').endOf('day').toDate() })
				.andWhere('events_vw.entity_type = :entity_type', { entity_type: query.type });

			// user get own appointment, if not admin
			if (query.type === (EventType.APPOINTMENT as string) && user.role !== (Role.ADMIN as string)) {
				event.andWhere('events_vw.user_id = :user_id', { user_id: user.id });
			}
		} else {
			// for type is all
			// for user that is not admin
			if (user.role !== (Role.ADMIN as string)) {
				event.andWhere(
					`(
                        events_vw.entity_type = :event
                        OR 
                        (events_vw.entity_type = :appointment AND events_vw.user_id = :uid)
                    )`,
					{ event: EventType.EVENT, appointment: EventType.APPOINTMENT, uid: user.id },
				);
			} else {
				// for admin
				event
					.andWhere('events_vw.entity_type IN (:...entity_type)', { entity_type: ['event', 'appointment'] })
					.andWhere('events_vw.event_deleted_at IS NULL');
			}

			event
				.andWhere('events_vw.event_date >= :start', { start: dayjs(query.from).tz('Asia/Manila').startOf('day').toDate() })
				.andWhere('events_vw.event_date <= :end', { end: dayjs(query.to).tz('Asia/Manila').endOf('day').toDate() })
				.andWhere('events_vw.event_deleted_at IS NULL');
		}

		const eventRes: EventView[] = await event.getRawMany();
		return eventRes;
	}
}
