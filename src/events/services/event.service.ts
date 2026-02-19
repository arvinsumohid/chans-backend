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
import { AnnouncementRepository } from '@/announcements/repositories/announcement.repository';
import { sendSmsIProg } from '@/helpers/sms.helper';
import dayjs from '@/utils/dayjs-config.util';
import { IsNull } from 'typeorm';
import { EventsPdfService } from '../services/event-pdf.service';

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
		private readonly announcementRepository: AnnouncementRepository,
		private readonly eventPdfService: EventsPdfService,
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

		const phDate = dayjs(createEventDto.event_date).utc().toDate();

		const eventData: Partial<Event> = {
			user_id: createEventDto.user_id,
			event_date: phDate as any,
			entity_type: createEventDto.type,
		};

		if (createEventDto.type === EventType.APPOINTMENT) {
			//check if is appointment on that date is already in limit
			const isAppointmentDateAvailable = await this.isAppointmentDateAvailable(phDate);
			if (!isAppointmentDateAvailable) {
				throw new BadRequestException('Appointment limit reached');
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

			eventData.entity_id = doctorService.id;
		} else if (createEventDto.type === EventType.EVENT) {
			const announcement = await this.announcementService.createAnnouncement(userId, {
				name: createEventDto.name,
				description: createEventDto.description,
			});

			eventData.entity_id = announcement.id;
		}

		const event = this.eventRepository.create(eventData);
		const savedEvent = await this.eventRepository.save(event);

		if (!savedEvent) {
			throw new NotFoundException('Something went wrong');
		}

		const eventView = await this.eventViewRepository.findOne({
			where: { event_id: savedEvent.id },
		});

		if (eventView) {
			if ((savedEvent.entity_type as EventType) === EventType.EVENT) {
				await this.sendSmsToBhw(eventView, 'created');
			} else if ((savedEvent.entity_type as EventType) === EventType.APPOINTMENT) {
				await Promise.all([this.sendSmsToAdmin(eventView, 'created'), this.sendSmsToUser(eventView, createEventDto.user_id, 'created')]);
			}
		}
		return savedEvent;
	}

	async findAll(req: UserRequest, query: EventListDto): Promise<ListResponsePaginationDto<EventView>> {
		const user = await this.userRepository.findOne({
			where: { id: req.user.id },
			select: ['id', 'role'],
		});
		return await this.eventViewRepository.findEvents(user, query);
	}

	async findOne(id: string): Promise<EventView> {
		const event = await this.eventViewRepository.findOne({
			where: { event_id: id },
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

	async update(userId: string, id: string, updateEventDto: UpdateEventDto): Promise<Event> {
		const event = await this.eventRepository.findOne({ where: { id } });
		let updatedEvent: Event | undefined;
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		if (event.user_id !== userId) {
			throw new BadRequestException('Unauthorized to update');
		}

		if (
			dayjs(event.event_date).tz('Asia/Manila').startOf('day').format('YYYY-MM-DD') <
			dayjs().tz('Asia/Manila').startOf('day').format('YYYY-MM-DD')
		) {
			throw new BadRequestException('Event date is in the past');
		}

		if (updateEventDto.type === EventType.EVENT) {
			// event update
			const announcement = await this.announcementRepository.findOne({ where: { id: event.entity_id } });
			if (!announcement) {
				throw new NotFoundException('Announcement not found');
			}

			const updatedAnnouncement = this.announcementRepository.create({
				...announcement,
				name: updateEventDto.name,
				description: updateEventDto.description,
			});

			await this.announcementRepository.save(updatedAnnouncement);

			const phDate = dayjs(updateEventDto.event_date).utc().toDate();

			updatedEvent = this.eventRepository.create({
				...event,
				event_date: phDate as any,
				id,
			});
		} else if (updateEventDto.type === EventType.APPOINTMENT) {
			// appointment update
			const service = await this.serviceRepository.findOne({ where: { id: updateEventDto.service_id }, select: ['id'] });
			if (!service) {
				throw new NotFoundException('Service not found');
			}

			const doctor = await this.doctorRepository.findOne({ where: { id: updateEventDto.doctor_id }, select: ['id'] });
			if (!doctor) {
				throw new NotFoundException('Doctor not found');
			}

			const doctorService = await this.doctorServiceRepository.findOne({
				where: {
					doctor_id: doctor.id,
					service_id: service.id,
				},
			});
			if (!doctorService) {
				throw new NotFoundException('Doctor service not found');
			}

			const phDate = dayjs(updateEventDto.event_date).utc().toDate();

			updatedEvent = this.eventRepository.create({
				...event,
				entity_id: doctorService.id,
				event_date: phDate as any,
				id,
			});
		}

		if (!updatedEvent) {
			throw new BadRequestException('Invalid event type');
		}

		const savedEvent = await this.eventRepository.save(updatedEvent);
		const eventView = await this.eventViewRepository.findOne({
			where: { event_id: savedEvent.id },
		});
		if (eventView) {
			if (updateEventDto.type === EventType.EVENT) {
				await this.sendSmsToBhw(eventView, 'updated');
			} else if (updateEventDto.type === EventType.APPOINTMENT) {
				await Promise.all([this.sendSmsToAdmin(eventView, 'updated'), this.sendSmsToUser(eventView, event.user_id, 'updated')]);
			}
		}

		return savedEvent;
	}

	async delete(userId: string, id: string): Promise<void> {
		const event = await this.eventRepository.findOne({ where: { id } });
		if (!event) {
			throw new NotFoundException('Event not found');
		}

		if (
			dayjs(event.event_date).tz('Asia/Manila').startOf('day').format('YYYY-MM-DD') <
			dayjs().tz('Asia/Manila').startOf('day').format('YYYY-MM-DD')
		) {
			throw new BadRequestException('Event date is in the past');
		}

		const eventView = await this.eventViewRepository.findOne({
			where: { event_id: event.id },
		});

		if (eventView) {
			if ((event.entity_type as EventType) === EventType.APPOINTMENT) {
				await Promise.all([this.sendSmsToAdmin(eventView, 'deleted'), this.sendSmsToUser(eventView, event.user_id, 'deleted')]);
			} else if ((event.entity_type as EventType) === EventType.EVENT) {
				await this.sendSmsToBhw(eventView, 'deleted');
			}
		}

		await this.eventRepository.softDelete(id);
	}

	private getEventTypeText(eventType: string): string {
		return (eventType as EventType) === EventType.APPOINTMENT ? 'Appointment' : 'Event';
	}

	async generateEventsPdf(req: UserRequest, query: EventListDto): Promise<Buffer> {
		const events = await this.findAll(req, { ...query, for_pdf: true, size: Number(process.env.DAILY_APPOINTMENT_LIMIT) });
		return await this.eventPdfService.generateEventsPdf(events);
	}

	async sendSmsToBhw(eventView: EventView, action: 'created' | 'updated' | 'deleted' = 'updated') {
		const users = await this.userRepository.find({ where: { is_bhw: true } });
		const phoneNumber = users.map((user) => user.phone_number).filter(Boolean);
		const eventType = this.getEventTypeText(eventView.entity_type);

		let actionText = '';
		switch (action) {
			case 'created':
				actionText = 'New';
				break;
			case 'updated':
				actionText = 'Updated';
				break;
			case 'deleted':
				actionText = 'Cancelled';
				break;
		}

		const message =
			`[${eventType} ${actionText}]\n\n` +
			`Upcoming Community Event Notification\n\n` +
			`Event: ${eventView.announcement_name}\n` +
			`Date: ${new Date(eventView.event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}\n` +
			`Details: ${eventView.announcement_description || 'Join us for this special event.'}`;

		console.log(`Sending SMS to BHW (${action}):`, message);

		// send sms to bhw
		await sendSmsIProg(phoneNumber.join(','), message, true);
	}

	async sendSmsToAdmin(eventView: EventView, action: 'created' | 'updated' | 'deleted' = 'updated') {
		const users = await this.userRepository.find({ where: { role: Role.ADMIN as string } });
		const phoneNumber = users.map((user) => user.phone_number).filter(Boolean);
		const eventType = this.getEventTypeText(eventView.entity_type);

		let actionText = '';
		switch (action) {
			case 'created':
				actionText = 'New';
				break;
			case 'updated':
				actionText = 'Updated';
				break;
			case 'deleted':
				actionText = 'Cancelled';
				break;
		}

		let message =
			`[${eventType} ${actionText}]\n\n` +
			`Date: ${new Date(eventView.event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}\n` +
			`Patient: ${eventView.user_firstname} ${eventView.user_lastname}\n` +
			`Service: ${eventView.service_name}\n` +
			`Personnel: ${eventView.doctor_firstname} ${eventView.doctor_lastname}`;

		if (process.env.SMS_STATIC_MESSAGE) {
			message = process.env.SMS_STATIC_MESSAGE;
		}

		console.log(`Sending SMS to Admin (${action}):`, message);
		// send sms to admin
		await sendSmsIProg(phoneNumber.join(','), message, true);
	}

	async sendSmsToUser(eventView: EventView, userId: string, action: 'created' | 'updated' | 'deleted' = 'updated') {
		const user = await this.userRepository.findOne({ where: { id: userId } });
		if (!user || !user.phone_number) return;

		const phoneNumber = user.phone_number;
		const eventType = this.getEventTypeText(eventView.entity_type);

		let actionText = '';
		switch (action) {
			case 'created':
				actionText = 'scheduled';
				break;
			case 'updated':
				actionText = 'updated';
				break;
			case 'deleted':
				actionText = 'cancelled';
				break;
		}

		let message =
			`Your ${eventType} has been ${actionText}.\n\n` +
			`Date: ${new Date(eventView.event_date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
			})}\n` +
			`Service: ${eventView.service_name}\n` +
			`Personnel: ${eventView.doctor_firstname} ${eventView.doctor_lastname}`;

		if (process.env.SMS_STATIC_MESSAGE) {
			message = process.env.SMS_STATIC_MESSAGE;
		}

		console.log(`Sending SMS to User (${action}):`, message);
		// send sms to user
		await sendSmsIProg(phoneNumber, message);
	}

	private async isAppointmentDateAvailable(date: Date): Promise<boolean> {
		const eventsAppointmentCount = await this.eventRepository.count({
			where: {
				event_date: dayjs(date).tz('Asia/Manila').startOf('day').format('YYYY-MM-DD'),
				entity_type: EventType.APPOINTMENT,
				deleted_at: IsNull(),
			},
		});
		return eventsAppointmentCount < Number(process.env.DAILY_APPOINTMENT_LIMIT);
	}
}
