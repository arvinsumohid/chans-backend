import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class AddressDto {
	@IsNotEmpty()
	user_id: string;

	@ApiProperty()
	@IsNotEmpty()
	region: string;

	@ApiProperty()
	@IsNotEmpty()
	province: string;

	@ApiProperty()
	@IsNotEmpty()
	city: string;

	@ApiProperty()
	@IsNotEmpty()
	barangay: string;

	@ApiProperty()
	@IsNotEmpty()
	address_line: string;

	@ApiProperty()
	@IsNotEmpty()
	postal_code: string;

	@ApiProperty()
	@IsOptional()
	country: string;
}

export class CreateAddressDto {
	user_id: string;
	region: string;
	province: string;
	city: string;
	barangay: string;
	address_line: string;
	postal_code: string;
	country: string;
}
