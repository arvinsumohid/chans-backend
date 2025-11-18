import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
	@ApiProperty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsString()
	middlename: string;

	@ApiProperty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsString()
	description: string;

	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
