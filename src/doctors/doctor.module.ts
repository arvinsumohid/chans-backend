import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { DoctorRepository } from './repositories/doctor.repository';
import { DoctorServiceRepository } from './repositories/doctor-service.repository';
import { DoctorServiceController } from './controllers/doctor-service.controller';
import { DoctorServiceService } from './services/doctor-service.service';
import { ServiceModule } from '@/services/service.module';

@Module({
	imports: [TypeOrmModule.forFeature([Doctor]), TypeOrmModule.forFeature([DoctorService]), ServiceModule],
	controllers: [DoctorController, DoctorServiceController],
	providers: [DoctorService, DoctorRepository, DoctorServiceRepository, DoctorServiceService],
	exports: [DoctorService, DoctorRepository, DoctorServiceRepository, DoctorServiceService],
})
export class DoctorModule {}
