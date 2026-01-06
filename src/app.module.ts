import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '@/auth/roles.guard';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './data-source';
import { AddressModule } from './addresses/address.module';
import { DoctorModule } from './doctors/doctor.module';
import { ServiceModule } from './services/service.module';
import { EventModule } from './events/event.module';
import { AnnouncementModule } from './announcements/announcement.module';
import { AppService } from './app.service';

@Module({
	imports: [
		AuthModule,
		AnnouncementModule,
		AddressModule,
		EventModule,
		DoctorModule,
		ServiceModule,
		UserModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot({
			...AppDataSource.options,
			logging: false,
			synchronize: false,
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL }); // applies to all routes
	}
}
