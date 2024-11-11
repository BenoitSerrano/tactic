import { Exam } from '../Exam.entity';

function sortExamsByDateTime(exams: Exam[]) {
    const sortedExams = {
        toCome: [] as Exam[],
        current: [] as Exam[],
        past: [] as Exam[],
    };
    const now = new Date().getTime();
    for (const exam of exams) {
        const startDateTime = new Date(exam.startTime).getTime();
        const endDateTime = exam.endTime ? new Date(exam.endTime).getTime() : Infinity;
        if (now < startDateTime) {
            sortedExams.toCome.push(exam);
        } else if (now > endDateTime) {
            sortedExams.past.push(exam);
        } else {
            sortedExams.current.push(exam);
        }
    }
    return sortedExams;
}

export { sortExamsByDateTime };
