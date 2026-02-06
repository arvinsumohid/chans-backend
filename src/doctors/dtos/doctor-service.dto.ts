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
	selected_service_ids: string[];

	@ApiProperty({
		required: true,
		type: [String],
		description: 'List of unselected service IDs',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	unselected_service_ids: string[];
}

export class AddDoctorViaServiceDto {
	@ApiProperty({
		required: true,
		type: [String],
		description: 'List of selected doctor IDs',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	selected_doctor_ids: string[];

	@ApiProperty({
		required: true,
		type: [String],
		description: 'List of unselected doctor IDs',
	})
	@IsArray()
	@ArrayNotEmpty()
	@IsString({ each: true })
	unselected_doctor_ids: string[];
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
