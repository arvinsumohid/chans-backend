import { DataSource } from 'typeorm';
import { SeederFactoryManager } from 'typeorm-extension';
import { SeederLog } from '../seeder-log/entities/seeder.log.entity';

export const withSeederLog = (
	name: string,
	seederFunction: (dataSource: DataSource, factoryManager: SeederFactoryManager) => Promise<void>,
) => {
	return async (dataSource: DataSource, factoryManager: SeederFactoryManager) => {
		const seederLogRepo = dataSource.getRepository(SeederLog);

		// Check if already seeded
		const alreadySeeded = await seederLogRepo.findOneBy({ name });
		if (alreadySeeded) {
			console.log(`${name} already run. Skipping.`);
			return;
		}

		await seederFunction(dataSource, factoryManager);

		await seederLogRepo.insert({ name });
		console.log(`${name} run successfully.`);
	};
};
