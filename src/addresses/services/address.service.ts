import { Injectable } from '@nestjs/common';
import { AddressRepository } from '../repositories/address.repository';
import { AddressDto } from '../dtos/address.dto';
import { Address } from '../entities/address.entity';

@Injectable()
export class AddressService {
	constructor(private readonly addressRepository: AddressRepository) {}

	async create(address: AddressDto): Promise<Address> {
		console.log('address', address);
		const newAddress = this.addressRepository.create(address);
		return this.addressRepository.save(newAddress);
	}

	async findAll(): Promise<Address[]> {
		return this.addressRepository.find();
	}
}
