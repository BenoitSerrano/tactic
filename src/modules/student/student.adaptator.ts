import { Attempt, attemptUtils } from '../attempt';
import { AttemptInterface } from '../attempt/attempt.interface';
import { Student } from './Student.entity';

const studentAdaptator = {
    formatStudentsIntoStudentsSummary,
};

function formatStudentsIntoStudentsSummary(studentsWithAttempts: Array<Student>) {
    const examIds: string[] = [];

    studentsWithAttempts.forEach((studentWithAttempts) => {
        studentWithAttempts.attempts.forEach((attempt) => {
            if (!examIds.includes(attempt.exam.id)) {
                examIds.push(attempt.exam.id);
            }
        });
    });

    const students = studentsWithAttempts.map((studentWithAttempts) => {
        return {
            id: studentWithAttempts.id,
            email: studentWithAttempts.email,
            createdDate: new Date(studentWithAttempts.createdDate).getTime(),
            examStatus: computeExamStatus(examIds, studentWithAttempts.attempts),
        };
    });

    return { examIds, students };
}

function computeExamStatus(examIds: string[], attempts: AttemptInterface[]) {
    const examStatus: Record<string, 'blank' | 'pending' | 'done'> = {};
    examIds.forEach((examId) => {
        examStatus[examId] = 'blank';
    });
    attempts.forEach((attempt) => {
        const status = attemptUtils.isTimeLimitExceeded(attempt, new Date()) ? 'done' : 'pending';
        examStatus[attempt.exam.id] = status;
    });
    return examStatus;
}

export { studentAdaptator };
