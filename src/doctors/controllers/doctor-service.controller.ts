import { Controller, Post, Body, UseGuards, Param, Get, Delete } from '@nestjs/common';
import { ApiResponse } from '../../utils/api.util';
import { AddServiceViaDoctorDto } from '../dtos/doctor-service.dto';
import { DoctorServiceService } from '../services/doctor-service.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('doctor-services')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class DoctorServiceController {
	constructor(private readonly doctorServiceService: DoctorServiceService) {}

	@Post('doctor/:doctor_id')
	async addServices(@Param('doctor_id') doctor_id: string, @Body() addServiceViaDoctorDto: AddServiceViaDoctorDto) {
		return ApiResponse(
			await this.doctorServiceService.addServicesByDoctor(doctor_id, addServiceViaDoctorDto),
			'Doctor service created successfully',
			201,
		);
	}

	@Get('doctor/:doctor_id')
	async getServicesByDoctor(@Param('doctor_id') doctor_id: string) {
		return ApiResponse(await this.doctorServiceService.getServicesByDoctor(doctor_id), 'Doctor services found successfully', 200);
	}

	@Delete('doctor/:doctor_id/service/:service_id')
	async deleteServices(@Param('doctor_id') doctor_id: string, @Param('service_id') service_id: string) {
		return ApiResponse(
			await this.doctorServiceService.deleteServicesByDoctor(doctor_id, service_id),
			'Doctor services deleted successfully',
			200,
		);
	}
}
