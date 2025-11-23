import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/mapped-types';

export class CreateServiceDto {
	@ApiProperty()
	@IsString()
	name: string;

	@ApiProperty()
	@IsString()
	description: string;

	@ApiProperty()
	@IsBoolean()
	@IsOptional()
	is_active?: boolean;
}

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
