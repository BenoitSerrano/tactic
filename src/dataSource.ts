import { DataSource } from 'typeorm';
import { config } from './config';

const dataSource = new DataSource({
    type: 'postgres',
    host: config.DB_HOST,
    port: config.DB_PORT,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,
    database: config.DB_NAME,
    logging: true,
    entities: [],
    subscribers: [],
    migrations: [],
});

export { dataSource };
