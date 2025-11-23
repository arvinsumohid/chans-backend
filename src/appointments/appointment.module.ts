import { Module } from '@nestjs/common';
import { AppointmentController } from './controllers/appointment.controller';
import { AppointmentService } from './services/appointment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentRepository } from './repositories/appointment.repository';
import { UserModule } from '@/users/user.module';
import { ServiceModule } from '@/services/service.module';
import { DoctorModule } from '@/doctors/doctor.module';

@Module({
	imports: [TypeOrmModule.forFeature([Appointment]), UserModule, ServiceModule, DoctorModule],
	controllers: [AppointmentController],
	providers: [AppointmentService, AppointmentRepository],
	exports: [AppointmentService, AppointmentRepository],
})
export class AppointmentModule {}
