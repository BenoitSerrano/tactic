import { DataSource } from 'typeorm';
import { config } from './config';
import { Exam } from './modules/exam';
import { QuestionChoixMultiple } from './modules/questionChoixMultiple';
import { Attempt } from './modules/attempt';
import { QcmAnswer } from './modules/qcmAnswer';
import { Student } from './modules/student';
import { QuestionTrou } from './modules/questionTrou';
import { QuestionTrouAnswer } from './modules/questionTrouAnswer';
import { PhraseMelangee } from './modules/phraseMelangee';
import { PhraseMelangeeAnswer } from './modules/phraseMelangeeAnswer';
import { User } from './modules/user';

const dataSource = new DataSource({
    type: 'postgres',
    host: config.DATABASE_HOST,
    port: config.DATABASE_PORT,
    username: config.DATABASE_USER,
    password: config.DATABASE_PASSWORD,
    database: config.DATABASE_NAME,
    logging: true,
    entities: [
        Exam,
        QuestionChoixMultiple,
        Attempt,
        QcmAnswer,
        Student,
        QuestionTrou,
        QuestionTrouAnswer,
        PhraseMelangee,
        PhraseMelangeeAnswer,
        User,
    ],
    subscribers: [],
    migrations: ['**/migrations/*.js'],
});

export { dataSource };
