import { Controller, Post, Get, Put, Delete, Param, Body, Query, Request, UseGuards } from '@nestjs/common';
import { EventService } from '../services/event.service';
import { CreateEventDto, UpdateEventDto, QueryCalendarDto, EventListDto } from '../dtos/event.dto';
import { ApiResponseDto } from '@/app.dto';
import { ApiResponse } from '@/utils/api.util';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserRequest } from '@/auth/dto/auth.dto';

@Controller('events')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class EventController {
	constructor(private readonly eventService: EventService) {}

	@Post()
	async createEvent(@Request() req: { user: { id: string } }, @Body() createEventDto: CreateEventDto): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		return ApiResponse(await this.eventService.createEvent(userId, createEventDto), 'Event created successfully', 201);
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
		return ApiResponse(await this.eventService.delete(userId, id), 'Event deleted successfully', 200);
	}
}
