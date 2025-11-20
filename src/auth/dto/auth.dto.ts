import { IsNotEmpty, MinLength, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
	@ApiProperty({ example: 'poccupine' })
	@IsNotEmpty()
	@IsString()
	username: string;

	@ApiProperty({ example: '123123' })
	@MinLength(6)
	@IsNotEmpty()
	@IsString()
	password: string;
}
