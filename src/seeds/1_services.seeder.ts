import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Service } from '../services/entities/service.entity';
import { withSeederLog } from '../utils/seeder-log.util';

export default class ServicesSeeder implements Seeder {
    track = false;

    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        await withSeederLog('ServicesSeeder', async (dataSource, factoryManager) => {
            const serviceRepo = dataSource.getRepository(Service);
            const servicesSeed = [
                {
                    name: 'Dental',
                    description: 'Dental',
                    is_active: true,
                },
                {
                    name: 'Laboratory',
                    description: 'Laboratory',
                    is_active: true,
                },
                {
                    name: 'Post-Exposure Prophylaxis',
                    description: 'Post-Exposure Prophylaxis (PEP) - tetanus, anti-rabies and etc.',
                    is_active: true,
                },
                {
                    name: 'Consultation',
                    description: 'Consultation',
                    is_active: true,
                },
            ];
            await serviceRepo.insert(servicesSeed);
        })(dataSource, factoryManager);
    }
}
