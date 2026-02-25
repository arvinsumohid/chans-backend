import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate, ValidateIf, IsEnum, IsOptional, IsBoolean, IsDateString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Event } from '../entities/event.entity';
import { UserDto } from '@/users/dtos/user.dto';
import { PaginationDto } from '@/common/common.dto';
import { EventType } from '@/users/enum/user.enum';

export class CreateEventDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	user_id: string;

	@ApiProperty()
	@ValidateIf((o: { type: string }) => o.type === 'appointment')
	@IsNotEmpty()
	@IsString()
	service_id: string;

	@ApiProperty()
	@ValidateIf((o: { type: string }) => o.type === 'appointment')
	@IsNotEmpty()
	@IsString()
	doctor_id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDate()
	event_date: Date;

	@ApiProperty()
	@ValidateIf((o: { type: string }) => o.type === 'event')
	@IsNotEmpty()
	name: string;

	@ApiProperty()
	@ValidateIf((o: { type: string }) => o.type === 'event')
	@IsNotEmpty()
	description: string;

	@ApiProperty({ enum: EventType })
	@IsNotEmpty()
	@IsEnum(EventType)
	type: EventType;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

export enum EventDateSortOrder {
	ASC = 'asc',
	DESC = 'desc',
}

export enum EventSortBy {
	APPOINTMENT_DATE = 'appointment_date',
}

export class QueryCalendarDto {
	@ApiProperty({ example: '2025-11-21', required: true })
	@IsNotEmpty()
	@IsString()
	from: string;

	@ApiProperty({ example: '2025-11-21', required: true })
	@IsNotEmpty()
	@IsString()
	to: string;

	@ApiProperty({ example: 'event', required: true })
	@IsNotEmpty()
	@IsString()
	type: string;
}

export class QueryAppointmentBookedCountDto {
	@ApiProperty({ example: '2026-02-19', required: true })
	@IsNotEmpty()
	@IsDateString()
	date: string;
}

export class EventListDto extends PaginationDto {
	@ApiProperty({ example: 'event', required: true })
	@IsNotEmpty()
	@IsString()
	type: string;

	@ApiProperty({ example: '', required: false })
	@ValidateIf((o: { from: string; to: string }) => o.to !== undefined)
	@IsString()
	from: string;

	@ApiProperty({ example: '', required: false })
	@ValidateIf((o: { from: string; to: string }) => o.from !== undefined)
	@IsString()
	to: string;

	@IsOptional()
	@IsBoolean()
	for_pdf?: boolean;

	@ApiProperty({ example: 'appointment_date', required: false, enum: EventSortBy })
	@IsOptional()
	@IsEnum(EventSortBy)
	sort_by?: EventSortBy;

	@ApiProperty({ example: 'asc', required: false, enum: EventDateSortOrder })
	@IsOptional()
	@IsEnum(EventDateSortOrder)
	sort_order?: EventDateSortOrder;
}

export class EventDto {
	adminEventListResponseDto(events: Event[]): Event[] {
		return events.map((event) => {
			return this.adminEventDetailResponseDto(event);
		});
	}

	adminEventDetailResponseDto(event: Event): Event {
		const user = UserDto.userResponseDto(event.user);

		return { ...event, user } as Event;
	}
}

export class CancelEventDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	reason: string;
}
