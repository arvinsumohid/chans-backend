import { PartialType } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	firstname: string;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsString()
	middlename: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	lastname: string;

	@ApiProperty({ required: true })
	@IsNotEmpty()
	@IsString()
	description: string;

	@ApiProperty({ required: false })
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {}
