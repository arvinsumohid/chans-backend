import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dtos/appointment.dto';
import { ApiResponseDto } from '@/app.dto';
import { ApiResponse } from '@/utils/api.util';

@Controller('appointments')
export class AppointmentController {
	constructor(private readonly appointmentService: AppointmentService) {}

	@Post()
	async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.appointmentService.createAppointment(createAppointmentDto), 'Appointment created successfully', 201);
	}

	@Get()
	async findAll(): Promise<ApiResponseDto> {
		return ApiResponse(await this.appointmentService.findAll(), 'Appointments found successfully', 200);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.appointmentService.findOne(id), 'Appointment found successfully', 200);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateAppointmentDto: UpdateAppointmentDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.appointmentService.update(id, updateAppointmentDto), 'Appointment updated successfully', 200);
	}

	@Delete(':id')
	async delete(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.appointmentService.delete(id), 'Appointment deleted successfully', 200);
	}
}
