import { DataSource } from 'typeorm';
import { config } from './config';
import { Exam } from './modules/exam';
import { QuestionChoixMultiple } from './modules/questionChoixMultiple';
import { Attempt } from './modules/attempt/Attempt.entity';
import { QcmAnswer } from './modules/qcmAnswer/QcmAnswer.entity';
import { Student } from './modules/student/Student.entity';

const dataSource = new DataSource({
    type: 'postgres',
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    logging: true,
    entities: [Exam, QuestionChoixMultiple, Attempt, QcmAnswer, Student],
    subscribers: [],
    migrations: ['**/migrations/*.js'],
});

export { dataSource };
