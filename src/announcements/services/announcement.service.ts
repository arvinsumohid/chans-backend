import { Injectable } from '@nestjs/common';
import { AnnouncementRepository } from '../repositories/announcement.repository';
import { CreateAnnouncementDto } from '../dtos/announcement.dto';
import { Announcement } from '../entities/announcement.entity';

@Injectable()
export class AnnouncementService {
	constructor(private readonly announcementRepository: AnnouncementRepository) {}

	async createAnnouncement(userId: string, createAnnouncementDto: CreateAnnouncementDto): Promise<Announcement> {
		const announcement = this.announcementRepository.create({
			...createAnnouncementDto,
		});
		return this.announcementRepository.save(announcement);
	}
}
