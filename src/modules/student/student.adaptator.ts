import { Exam } from '../exam';
import { Student } from './Student.entity';
import { computeExamStatus } from './lib/computeExamStatus';

const studentAdaptator = {
    formatStudentsIntoStudentsSummary,
};

function formatStudentsIntoStudentsSummary(
    studentsWithAttempts: Array<Student>,
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
) {
    const students = studentsWithAttempts.map((studentWithAttempts) => {
        return {
            id: studentWithAttempts.id,
            email: studentWithAttempts.email,
            createdDate: studentWithAttempts.createdDate,
            examStatus: computeExamStatus(exams, studentWithAttempts.attempts, new Date()),
        };
    });
    const examNames: Record<Exam['id'], Exam['name']> = {};
    Object.keys(exams).forEach((examId) => {
        examNames[examId] = exams[examId].name;
    });

    return { examNames, students };
}

export { studentAdaptator };
