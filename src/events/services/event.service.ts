import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { EventDto, EventListDto, CreateEventDto, UpdateEventDto, QueryCalendarDto } from '../dtos/event.dto';
import { Event } from '../entities/event.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { ServiceRepository } from '@/services/repositories/service.repository';
import { DoctorRepository } from '@/doctors/repositories/doctor.repository';
import { DoctorServiceRepository } from '@/doctors/repositories/doctor-service.repository';
import { Between, FindOperator, FindOptionsOrder, MoreThanOrEqual } from 'typeorm';
import { Role } from '@/users/enum/user.enum';
import { UserRequest } from '@/auth/dto/auth.dto';
import { ListResponsePaginationDto } from '@/common/common.dto';

@Injectable()
export class EventService {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly userRepository: UserRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly doctorRepository: DoctorRepository,
		private readonly doctorServiceRepository: DoctorServiceRepository,
	) {}

	async createEvent(userId: string, createEventDto: CreateEventDto): Promise<Event> {
		if (userId !== createEventDto.user_id) {
			throw new BadRequestException('Unauthorized to create event');
		}

		const user = await this.userRepository.findOne({
			where: {
				id: createEventDto.user_id,
			},
			select: ['id', 'role'],
		});

		if (!user) {
			throw new NotFoundException('User not found');
		}

		let type = 'appointment';

		if (user.role === (Role.ADMIN as string)) {
			type = 'event';
		}
		const service = await this.serviceRepository.findOne({ where: { id: createEventDto.service_id } });
		if (!service) {
			throw new NotFoundException('Service not found');
		}

		const doctor = await this.doctorRepository.findOne({ where: { id: createEventDto.doctor_id } });
		if (!doctor) {
			throw new NotFoundException('Doctor not found');
		}

		const doctorService = await this.doctorServiceRepository.findOne({
			where: {
				doctor_id: createEventDto.doctor_id || '',
				service_id: createEventDto.service_id || '',
			},
			select: ['id'],
		});
		if (!doctorService) {
			throw new NotFoundException('Doctor service not found');
		}

		const event = this.eventRepository.create({
			...createEventDto,
			event_date: new Date(createEventDto.event_date),
			doctor_service_id: doctorService.id,
			type,
		});
		return this.eventRepository.save(event);
	}

	async findAll(req: UserRequest, query: EventListDto): Promise<ListResponsePaginationDto<Event>> {
		const { page = 1, size = 10, type } = query;
		const { role, id } = req.user;
		const order: FindOptionsOrder<Event> = {
			event_date: 'ASC',
		};
		const whereClause: { event_date: FindOperator<Date>; type: string; user_id?: string } = {
			event_date: MoreThanOrEqual(new Date()),
			type,
		};

		if (role !== 'admin') {
			whereClause.user_id = id;
			delete whereClause.event_date;
			order.event_date = 'DESC';
		}

		const events = await this.eventRepository.find({
			where: whereClause,
			skip: (page - 1) * size,
			take: size,
			relations: ['doctor_service.doctor', 'doctor_service.service', 'user'],
			order,
		});

		const eventDto = new EventDto();
		const eventList = eventDto.adminEventListResponseDto(events);

		const total = await this.eventRepository.count({ where: whereClause });

		return { items: eventList, total_item: total, page, size };
	}

	async findOne(id: string): Promise<Event> {
		const event = await this.eventRepository.findOne({
			where: { id },
			relations: ['doctor_service.doctor', 'doctor_service.service'],
		});
		if (!event) {
			throw new NotFoundException('Event not found');
		}
		return event;
	}

	async findCalendar(userId: string, query: QueryCalendarDto): Promise<Event[]> {
		if (!query.from || !query.to || !query.type) {
			throw new BadRequestException('Missing required fields');
		}

		const user = await this.userRepository.findOne({
			where: { id: userId },
			select: ['id', 'role'],
		});
		if (!user) {
			throw new NotFoundException('User not found');
		}

		if (![Role.ADMIN as string, Role.USER as string].includes(user.role)) {
			throw new BadRequestException('Role Not found');
		}

		const where: { event_date: FindOperator<Date>; type: string; user_id?: string } = {
			event_date: Between(new Date(query.from), new Date(query.to)),
			type: query.type,
		};

		if (query.type !== 'event' && user.role !== 'admin') {
			where.user_id = userId;
		}

		const events = await this.eventRepository.find({
			where,
			relations: ['doctor_service.doctor', 'doctor_service.service', 'user'],
		});
		const eventDto = new EventDto();
		return eventDto.adminEventListResponseDto(events);
	}

	async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
		const event = await this.eventRepository.findOne({ where: { id } });
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		const updatedEvent = this.eventRepository.create({
			...event,
			...updateEventDto,
			id,
		});

		return this.eventRepository.save(updatedEvent);
	}

	async delete(id: string): Promise<void> {
		const event = await this.eventRepository.findOne({ where: { id } });
		if (!event) {
			throw new NotFoundException('Event not found');
		}
		await this.eventRepository.delete(id);
	}
}
