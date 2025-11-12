import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '../../utils/api.util';
import { ApiResponseDto } from '../../app.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() user: UserDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.create(user), 'User created successfully', 201);
	}

	@Get(':id')
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard('jwt'))
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.findOne(id), 'User found successfully', 200);
	}
}
