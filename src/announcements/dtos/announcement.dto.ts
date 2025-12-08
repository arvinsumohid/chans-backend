import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAnnouncementDto {
	@ApiProperty({ example: 'Announcement name' })
	@IsNotEmpty()
	@IsString()
	name: string;

	@ApiProperty({ example: 'Announcement description' })
	@IsNotEmpty()
	@IsString()
	description: string;
}
