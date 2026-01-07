import 'tsconfig-paths/register';
import { DataSource, DataSourceOptions } from 'typeorm';
import { setDataSource, SeederOptions } from 'typeorm-extension';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { getAllFiles } from './helpers/file-getter.helper';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const basePath = isProduction ? path.join(__dirname, '..') : __dirname;

const entitiesPath = isProduction ? path.join(basePath, 'dist', '**', '*.entity.js') : path.join(basePath, '**', '*.entity.{ts,js}');

const migrationsPath = isProduction ? path.join(basePath, 'dist', 'migrations', '*.js') : path.join(basePath, 'migrations', '*.{ts,js}');
const seederFiles = getAllFiles(path.join(basePath, 'seeds'));

// Let typeorm-extension use default seeder paths
const AppDataSource = new DataSource({
	type: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	port: Number(process.env.DB_PORT) || 3306,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: [entitiesPath],
	migrations: [migrationsPath],
	migrationsTableName: 'migrations',
	// seeds: ['src/seeds/**/*{.ts,.js}'],
	seeds: seederFiles,
	synchronize: false,
	logging: !isProduction,
} as DataSourceOptions & SeederOptions);

setDataSource(AppDataSource);

export default AppDataSource;
