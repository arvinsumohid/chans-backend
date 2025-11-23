import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { AddressRepository } from './repositories/address.repository';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';

@Module({
	imports: [TypeOrmModule.forFeature([Address])],
	providers: [AddressService, AddressRepository],
	exports: [AddressService, AddressRepository],
	controllers: [AddressController],
})
export class AddressModule {}
