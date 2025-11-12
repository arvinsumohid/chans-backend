import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Gender } from '../enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	password: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	firstname: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	middlename: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	lastname: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	email_address: string;

	@ApiProperty({ type: 'string', format: 'date' })
	@IsNotEmpty()
	@IsDate()
	birthdate: Date;

	@ApiProperty({ enum: Gender })
	@IsNotEmpty()
	@IsEnum(Gender)
	gender: Gender;

	@ApiProperty()
	@IsOptional()
	@IsString()
	phone_number: string;

	@ApiProperty()
	@IsOptional()
	@IsString()
	description: string;

	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	role: string;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	is_active: boolean;
}
