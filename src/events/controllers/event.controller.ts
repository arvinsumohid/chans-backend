import { Controller, Post, Get, Put, Delete, Param, Body, Query, Request, UseGuards, Res } from '@nestjs/common';
import { EventService } from '../services/event.service';
import {
	CreateEventDto,
	UpdateEventDto,
	QueryCalendarDto,
	EventListDto,
	QueryAppointmentBookedCountDto,
	CancelEventDto,
} from '../dtos/event.dto';
import { ApiResponseDto } from '@/app.dto';
import { ApiResponse } from '@/utils/api.util';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRequest } from '@/auth/dto/auth.dto';
import { EventsPdfService } from '../services/event-pdf.service';
import { Response } from 'express';

@Controller('events')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class EventController {
	constructor(
		private readonly eventService: EventService,
		private readonly eventPdfService: EventsPdfService,
	) { }

	@Post()
	async createEvent(@Request() req: { user: { id: string } }, @Body() createEventDto: CreateEventDto): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		const type = createEventDto.type.charAt(0).toUpperCase() + createEventDto.type.slice(1);
		return ApiResponse(await this.eventService.createEvent(userId, createEventDto), `${type} created successfully`, 201);
	}

	@Get()
	async findAll(@Request() req: UserRequest, @Query() query: EventListDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.eventService.findAll(req, query), 'Events found successfully', 200);
	}

	@Get('calendar')
	async findCalendar(@Request() req: UserRequest, @Query() query: QueryCalendarDto): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		return ApiResponse(await this.eventService.findCalendar(userId, query), 'Events found successfully', 200);
	}

	@Get('appointments/booked-count')
	async getAppointmentBookedCount(@Query() query: QueryAppointmentBookedCountDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.eventService.getAppointmentBookedCount(query.date), 'Appointment booked count fetched successfully', 200);
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.eventService.findOne(id), 'Event found successfully', 200);
	}

	@Put(':id')
	async update(@Request() req: UserRequest, @Param('id') id: string, @Body() updateEventDto: UpdateEventDto): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		return ApiResponse(await this.eventService.update(userId, id, updateEventDto), 'Event updated successfully', 200);
	}

	@Delete(':id')
	async delete(@Request() req: UserRequest, @Param('id') id: string): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		return ApiResponse(await this.eventService.delete(userId, id), 'Event canceled successfully', 200);
	}

	@Post(':id/cancel')
	async cancel(@Request() req: UserRequest, @Param('id') id: string, @Body() cancelEventDto: CancelEventDto): Promise<ApiResponseDto> {
		const userRole: string = req.user.role;
		return ApiResponse(await this.eventService.cancel(userRole, id, cancelEventDto), 'Event canceled successfully', 200);
	}

	@Get('export/pdf')
	async exportPdf(@Request() req: UserRequest, @Res() res: Response, @Query() query: EventListDto) {
		const pdfBuffer = await this.eventService.generateEventsPdf(req, query);

		res.set('Content-Type', 'application/pdf');
		res.set('Content-Disposition', 'attachment; filename="events.pdf"');

		res.send(pdfBuffer);
	}
}

