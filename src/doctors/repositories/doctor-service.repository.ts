import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { DoctorServices } from '../entities/doctor-service.entity';

@Injectable()
export class DoctorServiceRepository extends Repository<DoctorServices> {
	constructor(private dataSource: DataSource) {
		super(DoctorServices, dataSource.createEntityManager());
	}
}
