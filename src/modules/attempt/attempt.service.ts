import { dataSource } from '../../dataSource';
import { Exam } from '../exam';
import { Student } from '../student';
import { Attempt } from './Attempt.entity';
import { attemptAdaptator } from './attempt.adaptator';
import { attemptUtils } from './attempt.utils';

export { buildAttemptService };

function buildAttemptService() {
    const studentService = {
        searchAttempts,
        createAttempt,
        createEmptyAttempt,
        fetchAttempt,
        endAttempt,
        assertIsTimeLimitNotExceeded,
    };

    return studentService;

    async function searchAttempts(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);

        const attempt = await attemptRepository.find({
            where: { exam: { id: examId }, student: { id: studentId } },
        });
        return attempt;
    }

    async function createAttempt(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const attempt = await attemptRepository.save({ exam, student });

        return attempt;
    }

    async function createEmptyAttempt(examId: string, studentId: string) {
        const attemptRepository = dataSource.getRepository(Attempt);
        const studentRepository = dataSource.getRepository(Student);
        const examRepository = dataSource.getRepository(Exam);

        const student = await studentRepository.findOneByOrFail({ id: studentId });
        const exam = await examRepository.findOneByOrFail({ id: examId });

        const attempt = await attemptRepository.save({
            exam,
            student,
            endedAt: 'NOW()',
        });

        return attempt;
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
                'questionTrouAnswers',
                'questionTrouAnswers.questionTrou',
                'exam.questionsChoixMultiple',
                'exam.questionsTrou',
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
