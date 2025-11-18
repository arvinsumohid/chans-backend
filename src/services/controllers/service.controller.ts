import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseDto } from '../../app.dto';
import { ApiResponse } from '../../utils/api.util';
import { ServiceService } from '../services/service.service';
import { CreateServiceDto, UpdateServiceDto } from '../dtos/service.dto';

@Controller('services')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class ServiceController {
	constructor(private readonly serviceService: ServiceService) {}

	@Post()
	async create(@Body() createServiceDto: CreateServiceDto) {
		return ApiResponse(await this.serviceService.create(createServiceDto), 'Service created successfully', 201);
	}

	@Get()
	async findAll(): Promise<ApiResponseDto> {
		return ApiResponse(await this.serviceService.findAll(), 'Services found successfully', 200);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.serviceService.findOne(id), 'Service found successfully', 200);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.serviceService.update(id, updateServiceDto), 'Service updated successfully', 200);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.serviceService.delete(id), 'Service deleted successfully', 200);
	}
}
