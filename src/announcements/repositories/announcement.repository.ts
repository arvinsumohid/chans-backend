import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Announcement } from '../entities/announcement.entity';

@Injectable()
export class AnnouncementRepository extends Repository<Announcement> {
	constructor(private dataSource: DataSource) {
		super(Announcement, dataSource.createEntityManager());
	}
}
