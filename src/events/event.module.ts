import { Module } from '@nestjs/common';
import { EventController } from './controllers/event.controller';
import { EventService } from './services/event.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { EventRepository } from './repositories/event.repository';
import { UserModule } from '@/users/user.module';
import { ServiceModule } from '@/services/service.module';
import { DoctorModule } from '@/doctors/doctor.module';
import { AnnouncementModule } from '@/announcements/announcement.module';
import { EventViewRepository } from './repositories/event.view.repository';
import { EventsPdfService } from './services/event-pdf.service';

@Module({
	imports: [TypeOrmModule.forFeature([Event]), UserModule, ServiceModule, DoctorModule, AnnouncementModule],
	controllers: [EventController],
	providers: [EventService, EventRepository, EventViewRepository, EventsPdfService],
	exports: [EventService, EventRepository, EventViewRepository, EventsPdfService],
})
export class EventModule {}
