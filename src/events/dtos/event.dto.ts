import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Event } from '../entities/event.entity';
import { UserDto } from '@/users/dtos/user.dto';
import { PaginationDto } from '@/common/common.dto';

export class CreateEventDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	user_id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	service_id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	doctor_id: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsDate()
	event_date: Date;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}

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

export class EventListDto extends PaginationDto {
	@ApiProperty({ example: 'event', required: true })
	@IsNotEmpty()
	@IsString()
	type: string;
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
