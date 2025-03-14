import { DataSource } from 'typeorm';
import { config } from './config';
import { Exam } from './modules/exam';
import { Attempt } from './modules/attempt';
import { Student } from './modules/student';
import { User } from './modules/user';
import { Question } from './modules/question';
import { Exercise } from './modules/exercise';
import { ResetPasswordRequest } from './modules/resetPasswordRequest';
import { Classe } from './modules/classe';
import { UserConfiguration } from './modules/userConfiguration';
import { Establishment } from './modules/establishment';
import { Package } from './modules/package';
import { PaymentSession } from './modules/payment';

const dataSource = new DataSource({
    type: 'postgres',
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    logging: ['warn', 'error'],
    connectTimeoutMS: 20000,
    entities: [
        Exam,
        Attempt,
        Student,
        User,
        Question,
        Exercise,
        ResetPasswordRequest,
        Classe,
        UserConfiguration,
        Establishment,
        Package,
        PaymentSession,
    ],
    subscribers: [],
    migrations: ['**/migrations/*.js'],
});

export { dataSource };
