import { Controller } from '@nestjs/common';
import { AddressService } from '../services/address.service';

@Controller('addresses')
export class AddressController {
	constructor(private readonly addressService: AddressService) {}

	// @Post()
	// async create(@Body() createAddressDto: CreateAddressDto) {
	// 	return this.addressService.create(createAddressDto);
	// }

	// @Get()
	// async findAll(): Promise<Address[]> {
	// 	return this.addressService.findAll();
	// }
}
