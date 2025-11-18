import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Service } from './entities/service.entity';
import { ServiceController } from './controllers/service.controller';
import { ServiceService } from './services/service.service';
import { ServiceRepository } from './repositories/service.repository';

@Module({
	imports: [TypeOrmModule.forFeature([Service])],
	controllers: [ServiceController],
	providers: [ServiceService, ServiceRepository],
})
export class ServiceModule {}
