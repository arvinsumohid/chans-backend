import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Gender, Role } from '../enum/user.enum';
import { ApiProperty } from '@nestjs/swagger';
import { AddressDto } from '@/addresses/dtos/address.dto';
import { Type } from 'class-transformer';
import { User } from '../entities/user.entity';
import { Address } from '@/addresses/entities/address.entity';

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

	static mapToUserEntities(users: UserRawDto[]): User[] {
		return users.map((userRaw) => {
			const user = this.mapToUserEntity(userRaw);
			const address = this.mapToAddressEntity(userRaw);

			user.address = address ?? null;
			return user;
		});
	}

	static mapToUserEntity(raw: UserRawDto): User {
		const userRes = new User();

		userRes.id = raw.id;
		userRes.username = raw.username;
		userRes.firstname = raw.firstname;
		userRes.middlename = raw.middlename;
		userRes.lastname = raw.lastname;
		userRes.email_address = raw.email_address;
		userRes.birthdate = raw.birthdate;
		userRes.gender = raw.gender;
		userRes.phone_number = raw.phone_number;
		userRes.description = raw.description;
		userRes.role = raw.role;
		userRes.is_active = raw.is_active;
		userRes.last_login_at = raw.last_login_at;

		return userRes;
	}

	static mapToAddressEntity(raw: UserRawDto): Address {
		const addressRes = new Address();
		addressRes.id = raw.address_id;
		addressRes.region = raw.address_region;
		addressRes.province = raw.address_province;
		addressRes.city = raw.address_city;
		addressRes.barangay = raw.address_barangay;
		addressRes.address_line = raw.address_address_line;
		addressRes.postal_code = raw.address_postal_code;
		addressRes.country = raw.address_country;

		return addressRes;
	}
}

export class UserRawDto {
	address_id: string;
	address_region: string;
	address_province: string;
	address_city: string;
	address_barangay: string;
	address_address_line: string;
	address_postal_code: string;
	address_country: string;
	id: string;
	username: string;
	firstname: string;
	middlename: string;
	lastname: string;
	email_address: string;
	birthdate: Date;
	gender: string;
	phone_number: string;
	description: string;
	role: string;
	is_active: boolean;
	last_login_at: Date;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}
