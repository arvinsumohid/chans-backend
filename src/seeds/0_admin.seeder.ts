import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { withSeederLog } from '../utils/seeder-log.util';
import { Role } from '../users/enum/user.enum';
import bcrypt from 'bcrypt';

export default class AdminSeeder implements Seeder {
	track = false;

	public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
		await withSeederLog('AdminSeeder', async (dataSource, factoryManager) => {
			const userRepo = dataSource.getRepository(User);

			const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
			await userRepo.insert({
				username: process.env.ADMIN_USERNAME,
				password: hashed,
				firstname: process.env.ADMIN_FIRSTNAME || 'Admin',
				middlename: '',
				lastname: process.env.ADMIN_LASTNAME || 'User',
				email_address: process.env.ADMIN_EMAIL || 'admin@example.com',
				birthdate: new Date('1990-01-01'),
				gender: 'male',
				phone_number: process.env.ADMIN_PHONE_NUMBER || '',
				description: 'System Administrator',
				role: Role.ADMIN,
				is_active: true,
			});
		})(dataSource, factoryManager);
	}
}
