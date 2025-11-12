import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/logger.middleware';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import AppDataSource from './data-source';

@Module({
	imports: [
		AuthModule,
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
	providers: [AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL }); // applies to all routes
	}
}
