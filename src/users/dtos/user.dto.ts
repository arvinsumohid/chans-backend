import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Gender, Role } from '../enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '@/addresses/dtos/address.dto';
import { Type } from 'class-transformer';
import { User } from '../entities/user.entity';

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

	@ApiProperty({ enum: Role })
	@IsNotEmpty()
	@IsEnum(Role)
	role: Role;

	@ApiProperty()
	@IsOptional()
	@IsBoolean()
	is_active: boolean;

	@ApiProperty()
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => AddressDto)
	address: AddressDto;

	public static usersListResponseDto(users: User[]): User[] {
		return users.map((user) => {
			return this.userResponseDto(user);
		});
	}

	public static userResponseDto(user: User): User {
		const { birthdate, description, email_address, firstname, gender, id, lastname, middlename, phone_number, username } = user;
		return { birthdate, description, email_address, firstname, gender, id, lastname, middlename, phone_number, username } as User;
	}
}
