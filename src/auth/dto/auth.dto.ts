import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty()
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty()
	@MinLength(6)
	@IsNotEmpty()
	@IsString()
	password: string;
}
