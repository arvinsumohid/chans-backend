import { Controller, Post, Get, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto, QueryCalendarDto } from '../dtos/appointment.dto';
import { ApiResponseDto } from '@/app.dto';
import { ApiResponse } from '@/utils/api.util';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('appointments')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
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

	@Get('calendar')
	async findCalendar(@Request() req, @Query() query: QueryCalendarDto): Promise<ApiResponseDto> {
		const userId: string = req.user.id as string;
		console.log(userId);
		return ApiResponse(await this.appointmentService.findCalendar(userId, query), 'Appointments found successfully', 200);
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
