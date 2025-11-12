import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../users/services/user.service';
import { LoginDto } from '../dto/auth.dto';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	async validateUser(username: string, password: string): Promise<User> {
		const user = await this.userService.findByUsername(username);
		if (user && (await this.userService.validatePassword(password, user.password))) {
			const { password, ...result } = user;
			void password;
			return result as User;
		}
		throw new UnauthorizedException('Invalid credentials');
	}

	async login(user: LoginDto) {
		if (user.password) {
			const payload = await this.validateUser(user.username, user.password);
			const { created_at, updated_at, deleted_at, ...userData } = payload;
			void created_at;
			void updated_at;
			void deleted_at;
			if (payload) {
				return {
					access_token: this.jwtService.sign(payload, {
						secret: process.env.JWT_SECRET,
					}),
					user: userData,
				};
			}

			throw new UnauthorizedException('Invalid credentials');
		}
		throw new BadRequestException('Invalid credentials');
	}
}
