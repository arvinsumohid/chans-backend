import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
	@ApiProperty({ example: 1, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	page?: number;

	@ApiProperty({ example: 10, required: false })
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	size?: number;

	@ApiProperty({ example: '', required: false })
	@IsOptional()
	@Type(() => String)
	@IsString()
	search?: string;
}

export class ListResponsePaginationDto<T> {
	items: T[];
	total_item: number;
	page: number;
	size: number;
}
