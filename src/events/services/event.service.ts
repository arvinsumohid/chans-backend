import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { EventListDto, CreateEventDto, UpdateEventDto, QueryCalendarDto } from '../dtos/event.dto';
import { Event } from '../entities/event.entity';
import { UserRepository } from '@/users/repositories/user.repository';
import { ServiceRepository } from '@/services/repositories/service.repository';
import { DoctorRepository } from '@/doctors/repositories/doctor.repository';
import { DoctorServiceRepository } from '@/doctors/repositories/doctor-service.repository';
import { Role, EventType } from '@/users/enum/user.enum';
import { UserRequest } from '@/auth/dto/auth.dto';
import { ListResponsePaginationDto } from '@/common/common.dto';
import { AnnouncementService } from '@/announcements/services/announcement.service';
import { EventViewRepository } from '../repositories/event.view.repository';
import { EventView } from '../entities/event.view.entity';

@Injectable()
export class EventService {
	constructor(
		private readonly eventRepository: EventRepository,
		private readonly eventViewRepository: EventViewRepository,
		private readonly userRepository: UserRepository,
		private readonly serviceRepository: ServiceRepository,
		private readonly doctorRepository: DoctorRepository,
		private readonly doctorServiceRepository: DoctorServiceRepository,
		private readonly announcementService: AnnouncementService,
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

		if (![EventType.EVENT, EventType.APPOINTMENT].includes(createEventDto.type)) {
			throw new BadRequestException('Invalid event type');
		}

		if (createEventDto.type === EventType.EVENT && user.role !== (Role.ADMIN as string)) {
			throw new BadRequestException('Unauthorized to create event');
		}

		const eventData: Partial<Event> = {
			user_id: createEventDto.user_id,
			event_date: new Date(createEventDto.event_date),
			entity_type: createEventDto.type,
		};

		if (createEventDto.type === EventType.APPOINTMENT) {
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

			eventData.entity_id = doctorService.id;
		} else if (createEventDto.type === EventType.EVENT) {
			const announcement = await this.announcementService.createAnnouncement(userId, {
				name: createEventDto.name,
				description: createEventDto.description,
			});

			eventData.entity_id = announcement.id;
		}

		const event = this.eventRepository.create(eventData);
		return this.eventRepository.save(event);
	}

	async findAll(req: UserRequest, query: EventListDto): Promise<ListResponsePaginationDto<EventView>> {
		const user = await this.userRepository.findOne({
			where: { id: req.user.id },
			select: ['id', 'role'],
		});
		return await this.eventViewRepository.findEvents(user, query);
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

	async findCalendar(userId: string, query: QueryCalendarDto): Promise<EventView[]> {
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

		return await this.eventViewRepository.findEventsCalendar(user, query);
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
