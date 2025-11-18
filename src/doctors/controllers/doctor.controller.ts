import { Controller } from '@nestjs/common';
import { Post, Get, Put, Delete, Body, Param } from '@nestjs/common';
import { DoctorService } from '../services/doctor.service';
import { CreateDoctorDto, UpdateDoctorDto } from '../dtos/doctor.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponseDto } from '../../app.dto';
import { ApiResponse } from '../../utils/api.util';

@Controller('doctors')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class DoctorController {
	constructor(private readonly doctorService: DoctorService) {}

	@Post()
	async create(@Body() createDoctorDto: CreateDoctorDto) {
		return ApiResponse(await this.doctorService.create(createDoctorDto), 'Doctor created successfully', 201);
	}

	@Get()
	async findAll(): Promise<ApiResponseDto> {
		return ApiResponse(await this.doctorService.findAll(), 'Doctors found successfully', 200);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.doctorService.findOne(id), 'Doctor found successfully', 200);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.doctorService.update(id, updateDoctorDto), 'Doctor updated successfully', 200);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.doctorService.delete(id), 'Doctor deleted successfully', 200);
	}
}
