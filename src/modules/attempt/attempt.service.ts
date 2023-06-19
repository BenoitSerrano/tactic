import { dataSource } from '../../dataSource';
import { Exam } from '../exam';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';

export { buildAttemptService };

function buildAttemptService() {
    const studentService = {
        findOrCreateAttempt,
        fetchAttempt,
        endAttempt,
        assertIsTimeLimitNotExceeded,
    };

    return studentService;

    async function findOrCreateAttempt(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const result = await attemptRepository.upsert({ exam, student }, ['student', 'exam']);
        if (result.identifiers.length !== 1) {
            throw new Error(`Error while upserting student ${student.id} / exam ${exam.id}`);
        }
        return result.identifiers[0];
    }

    async function fetchAttempt(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.findOneOrFail({
            where: { id: attemptId },
            order: {
                exam: {
                    questionsChoixMultiple: { order: 'ASC' },
                },
            },
            relations: [
                'exam',
                'qcmAnswers',
                'exam.questionsChoixMultiple',
                'qcmAnswers.questionChoixMultiple',
            ],
        });

        return attemptAdaptator.convertAttemptToAttemptWithChoices(attempt);
    }

    async function assertIsTimeLimitNotExceeded(attempt: Attempt) {
        if (attemptUtils.isTimeLimitExceeded(attempt, new Date())) {
            endAttempt(attempt.id);
            throw new Error(`The time limit is exceeded!`);
        }
    }

    async function endAttempt(attemptId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.findOneByOrFail({ id: attemptId });
        if (!attempt.endedAt) {
            const result = await attemptRepository.update(
                { id: attemptId },
                { endedAt: () => 'CURRENT_TIMESTAMP' },
            );
            return result.affected == 1;
        }

        return false;
    }
}
