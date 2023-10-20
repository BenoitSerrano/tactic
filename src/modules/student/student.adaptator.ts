import { attemptUtils } from '../attempt';
import { AttemptInterface } from '../attempt/attempt.interface';
import { Exam } from '../exam';
import { Student } from './Student.entity';

const studentAdaptator = {
    formatStudentsIntoStudentsSummary,
};

function formatStudentsIntoStudentsSummary(studentsWithAttempts: Array<Student>) {
    const exams: Record<Exam['id'], Exam['name']> = {};

    studentsWithAttempts.forEach((studentWithAttempts) => {
        studentWithAttempts.attempts.forEach((attempt) => {
            if (!Object.keys(exams).includes(attempt.exam.id)) {
                exams[attempt.exam.id] = attempt.exam.name;
            }
        });
    });

    const students = studentsWithAttempts.map((studentWithAttempts) => {
        return {
            id: studentWithAttempts.id,
            email: studentWithAttempts.email,
            createdDate: new Date(studentWithAttempts.createdDate).getTime(),
            examStatus: computeExamStatus(Object.keys(exams), studentWithAttempts.attempts),
        };
    });

    return { exams, students };
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
