import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserService, UserRepository],
	exports: [UserService, UserRepository],
	controllers: [UserController],
})
export class UserModule {}
