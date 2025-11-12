import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
	private readonly SALT_ROUNDS = 10;
	constructor(private userRepository: UserRepository) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findOne(id: string): Promise<User> {
		const user = await this.userRepository.findOne({
			where: { id },
			select: [
				'id',
				'username',
				'firstname',
				'lastname',
				'email_address',
				'birthdate',
				'gender',
				'phone_number',
				'description',
				'role',
				'is_active',
				'created_at',
				'updated_at',
				'deleted_at',
			],
		});
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	async findByUsername(username: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { username } });
		if (!user) {
			throw new Error('User not found');
		}
		return user;
	}

	async create(user: UserDto): Promise<User> {
		const checkUser = await this.userRepository.findOne({
			where: { username: user.username },
			select: ['id'],
		});
		if (checkUser) {
			throw new Error('User already exists');
		}

		const hashed = await this.hashPassword(user.password);
		user.password = hashed;

		const newUser = this.userRepository.create(user);
		return this.userRepository.save(newUser);
	}

	async update(id: string, user: UserDto): Promise<User> {
		return this.userRepository.save({ ...user, id });
	}

	async delete(id: string): Promise<void> {
		await this.userRepository.delete(id);
	}

	async hashPassword(password: string): Promise<string> {
		return await bcrypt.hash(password, this.SALT_ROUNDS);
	}

	async validatePassword(password: string, hashed: string): Promise<boolean> {
		return await bcrypt.compare(password, hashed);
	}
}
