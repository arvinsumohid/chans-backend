import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class AddServiceViaDoctorDto {
	@ApiProperty({
		required: true,
		type: [String],
		description: 'List of selected service IDs',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	service_ids: string[];
}

export class DeleteServiceViaDoctorDto {
	@ApiProperty({
		required: true,
		type: [String],
		description: 'List of selected service IDs',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	service_ids: string[];
}
