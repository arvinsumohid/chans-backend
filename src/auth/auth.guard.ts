// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtPayload } from './interfaces/auth.interface';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Extend Express Request to include user
declare module 'express' {
	interface Request {
		user?: JwtPayload;
	}
}

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		// Extract token from Authorization header
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException('Access token is required');
		}

		try {
			// Verify and decode JWT token
			const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
				secret: process.env.JWT_SECRET,
			});

			// Attach user to request object
			request.user = payload;

			// Check role-based access
			const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [context.getHandler(), context.getClass()]);

			if (requiredRoles && requiredRoles.length > 0) {
				const hasRole = requiredRoles.some((role) => payload.roles?.includes(role));

				if (!hasRole) {
					throw new ForbiddenException('Insufficient permissions');
				}
			}

			return true;
		} catch (error) {
			if (error instanceof ForbiddenException) {
				throw error;
			}
			throw new UnauthorizedException('Invalid or expired token');
		}
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
