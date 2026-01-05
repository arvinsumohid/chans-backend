import { Controller, Post, Body, Get, Param, Query, UseGuards, Request, Put } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserDto } from '../dtos/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse } from '../../utils/api.util';
import { ApiResponseDto } from '../../app.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from '@/common/common.dto';
@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	async create(@Body() user: UserDto): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.create(user), 'User created successfully', 201);
	}

	@Get()
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard('jwt'))
	async findAll(@Request() req: { user: { id: string } }, @Query() pagination: PaginationDto): Promise<ApiResponseDto> {
		const userId = req.user.id;
		return ApiResponse(await this.userService.findAll(userId, pagination), 'Users found successfully', 200);
	}

	@Get(':id')
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard('jwt'))
	async findOne(@Param('id') id: string): Promise<ApiResponseDto> {
		return ApiResponse(await this.userService.findOne(id), 'User found successfully', 200);
	}

	@Put(':id/bhw')
	@ApiBearerAuth('access-token')
	@UseGuards(AuthGuard('jwt'))
	async updateIsBhw(
		@Param('id') id: string,
		@Request() req: { user: { id: string } },
		@Body() body: { is_bhw: boolean },
	): Promise<ApiResponseDto> {
		const userId = req.user.id;
		const isBhw = body.is_bhw;
		return ApiResponse(await this.userService.updateIsBhw(userId, id, isBhw), 'User updated successfully', 200);
	}
}
