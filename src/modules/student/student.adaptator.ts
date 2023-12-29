import { Exam } from '../exam';
import { Student } from './Student.entity';
import { computeExamStatus } from '../lib/computeExamStatus';
import { questionDtoType } from '../question/types';

const studentAdaptator = {
    formatStudentsIntoStudentsSummary,
};

function formatStudentsIntoStudentsSummary(
    studentsWithAttempts: Array<Student>,
    exams: Record<Exam['id'], Pick<Exam, 'id' | 'name' | 'duration' | 'extraTime'>>,
    questionsByExamId: Record<Exam['id'], questionDtoType[]>,
) {
    const students = studentsWithAttempts.map((studentWithAttempts) => {
        return {
            id: studentWithAttempts.id,
            email: studentWithAttempts.email,
            createdDate: studentWithAttempts.createdDate,
            examStatus: computeExamStatus(
                exams,
                studentWithAttempts.attempts,
                questionsByExamId,
                new Date(),
            ),
        };
    });
    const examInfos: Record<Exam['id'], { name: Exam['name']; totalPoints: number }> = {};
    Object.keys(exams).forEach((examId) => {
        const totalPoints = questionsByExamId[examId].reduce(
            (sum, questionDto) => sum + questionDto.points,
            0,
        );
        examInfos[examId] = { name: exams[examId].name, totalPoints };
    });

    return { examInfos, students };
}

export { studentAdaptator };
