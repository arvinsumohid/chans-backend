import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAppointmentDto {
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
	appointment_date: Date;
}

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {}

export class QueryCalendarDto {
	@ApiProperty({ example: '2025-11-21', required: true })
	@IsNotEmpty()
	@IsString()
	from: string;

	@ApiProperty({ example: '2025-11-21', required: true })
	@IsNotEmpty()
	@IsString()
	to: string;
}
