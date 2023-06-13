import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    DB_HOST: process.env.DB_HOST || '',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_USERNAME: process.env.DB_USERNAME || '',
    DB_NAME: process.env.DB_NAME || '',
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
};

export { config };
