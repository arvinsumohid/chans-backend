import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserModule } from '../users/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './controllers/auth.controller';

@Module({
	imports: [
		UserModule,
		PassportModule,
		JwtModule.register({
			secret: 'SECRET_KEY', // Use env variable in production
			signOptions: { expiresIn: '1h' },
		}),
	],
	providers: [AuthService, JwtStrategy],
	controllers: [AuthController],
})
export class AuthModule {}
