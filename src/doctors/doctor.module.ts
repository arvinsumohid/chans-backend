import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { DoctorController } from './controllers/doctor.controller';
import { DoctorService } from './services/doctor.service';
import { DoctorRepository } from './repositories/doctor.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Doctor])],
	controllers: [DoctorController],
	providers: [DoctorService, DoctorRepository],
})
export class DoctorModule {}
