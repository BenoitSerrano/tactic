import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Student } from './Student.entity';
import { studentAdaptator } from './student.adaptator';
import { Exam, buildExamService } from '../exam';
import { Classe } from '../classe';
import { buildClasseService } from '../classe/classe.service';
import { buildQuestionService } from '../question';

export { buildStudentService };

function buildStudentService() {
    const studentRepository = dataSource.getRepository(Student);

    const studentService = {
        getAllStudents,
        createStudents,
        getStudents,
        getStudent,
        updateStudentNames,
        getStudentsWithAttempts,
        getStudentByEmailForExam,
        deleteStudent,
        bulkInsertStudents,
        updateStudentClasse,
        countStudentByClasse,
    };

    return studentService;

    async function countStudentByClasse(classeId: Classe['id']) {
        const studentsCount = await studentRepository.count({
            where: { classe: { id: classeId } },
            relations: { classe: true },
            select: { classe: { id: true } },
        });
        return { studentsCount };
    }

    async function getAllStudents() {
        const students = await studentRepository.find({
            relations: ['classe'],
            select: { classe: { id: true } },
        });
        return students;
    }

    async function getStudent(studentId: Student['id']) {
        const student = await studentRepository.findOneOrFail({
            where: { id: studentId },
            select: { id: true, firstName: true, email: true, lastName: true },
        });
        return student;
    }

    async function updateStudentNames(
        studentId: Student['id'],
        names: { firstName?: string; lastName?: string },
    ) {
        return studentRepository.update(
            { id: studentId },
            { firstName: names.firstName, lastName: names.lastName?.toUpperCase() },
        );
    }

    async function getStudentsWithAttempts(classeId: Classe['id']) {
        const questionService = buildQuestionService();
        const studentsWithAttempts = await studentRepository.find({
            where: { classe: { id: classeId } },
            select: {
                attempts: {
                    id: true,
                    startedAt: true,
                    endedAt: true,
                    answers: true,
                    manualMarks: true,
                    exam: { id: true },
                },
                classe: { id: true },
            },
            relations: ['attempts', 'attempts.exam', 'classe'],
        });
        const examIds: Array<Exam['id']> = [];
        for (const student of studentsWithAttempts) {
            for (const attempt of student.attempts) {
                if (!examIds.includes(attempt.exam.id)) {
                    examIds.push(attempt.exam.id);
                }
            }
        }
        const examService = buildExamService();
        const exams = await examService.getExamsByIds(examIds);
        const questionsByExamId = await questionService.getQuestionsByExamId(examIds);
        const studentsSummary = studentAdaptator.formatStudentsIntoStudentsSummary(
            studentsWithAttempts,
            exams,
            questionsByExamId,
        );
        return studentsSummary;
    }

    async function getStudents(studentIds: Student['id'][]) {
        const students = await studentRepository.find({
            where: { id: In(studentIds) },
            select: { id: true, email: true, firstName: true, lastName: true },
        });
        return students.reduce((acc, student) => {
            return { ...acc, [student.id]: student };
        }, {} as Record<string, Student>);
    }

    async function getStudentByEmailForExam(criteria: { examId: Exam['id']; email: string }) {
        const examService = buildExamService();
        const examUserId = await examService.getUserIdForExam(criteria.examId);
        return studentRepository.findOneOrFail({
            where: {
                email: criteria.email.trim().toLowerCase(),
                // TODO
                // classe: { user: { id: examUserId } },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                // TODO
                // classe: { id: true, user: { id: true } },
            },
            relations: ['classe', 'classe.user'],
        });
    }

    async function createStudents(criteria: { classeId: Classe['id'] }, emails: string[]) {
        const { classeId } = criteria;

        const classeService = buildClasseService();
        const classe = await classeService.getClasse(classeId);
        const students = emails.map((email) => {
            const student = new Student();
            student.email = email.trim().toLowerCase();
            student.classe = classe;
            return student;
        });
        return studentRepository.upsert(students, ['email', 'classe']);
    }

    async function deleteStudent(studentId: Student['id']) {
        const result = await studentRepository.delete({ id: studentId });
        return result.affected == 1;
    }

    async function bulkInsertStudents(students: Array<Student>) {
        return studentRepository.insert(students);
    }

    async function updateStudentClasse(
        criteria: { studentId: Student['id'] },
        body: { newClasseId: Classe['id'] },
    ) {
        const classeService = buildClasseService();
        const classe = await classeService.getClasse(body.newClasseId);
        const result = await studentRepository.update(
            { id: criteria.studentId },
            { classe: classe },
        );
        return result.affected === 1;
    }
}
