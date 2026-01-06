import { Module } from '@nestjs/common';
import { AnnouncementController } from './controllers/announcement.controller';
import { AnnouncementService } from './services/announcement.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementRepository } from './repositories/announcement.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Announcement])],
	controllers: [AnnouncementController],
	providers: [AnnouncementService, AnnouncementRepository],
	exports: [AnnouncementService, AnnouncementRepository],
})
export class AnnouncementModule {}
