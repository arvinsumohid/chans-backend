import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AnnouncementService } from '../services/announcement.service';
import { CreateAnnouncementDto } from '../dtos/announcement.dto';
import { ApiResponseDto } from '@/app.dto';
import { ApiResponse } from '@/utils/api.util';
// import { Roles } from '@/auth/roles.guard';

@Controller('announcements')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard('jwt'))
export class AnnouncementController {
	constructor(private readonly announcementService: AnnouncementService) {}

	@Post()
	// @Roles('admin')
	async createAnnouncement(
		@Request() req: { user: { id: string } },
		@Body() createAnnouncementDto: CreateAnnouncementDto,
	): Promise<ApiResponseDto> {
		const userId: string = req.user.id;
		return ApiResponse(
			await this.announcementService.createAnnouncement(userId, createAnnouncementDto),
			'Announcement created successfully',
			201,
		);
	}
}
