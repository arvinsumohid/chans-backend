import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';

@Injectable()
export class DoctorRepository extends Repository<Doctor> {
	constructor(private dataSource: DataSource) {
		super(Doctor, dataSource.createEntityManager());
	}
}
