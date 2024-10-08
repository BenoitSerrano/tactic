import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { Student } from './Student.entity';
import { studentAdaptator } from './student.adaptator';
import { Exam, buildExamService } from '../exam';
import { Group } from '../group';
import { buildGroupService } from '../group/group.service';
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
        fetchStudentByEmailForExam,
        deleteStudent,
        bulkInsertStudents,
        changeGroup,
    };

    return studentService;

    async function getAllStudents() {
        const students = await studentRepository.find({
            relations: ['group'],
            select: { group: { id: true } },
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

    async function getStudentsWithAttempts(groupId: Group['id']) {
        const questionService = buildQuestionService();
        const studentsWithAttempts = await studentRepository.find({
            where: { group: { id: groupId } },
            select: {
                attempts: {
                    id: true,
                    startedAt: true,
                    endedAt: true,
                    answers: true,
                    manualMarks: true,
                    exam: { id: true },
                },
                group: { id: true },
            },
            relations: ['attempts', 'attempts.exam', 'group'],
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

    async function fetchStudentByEmailForExam(criteria: { examId: Exam['id']; email: string }) {
        const examService = buildExamService();
        const examUserId = await examService.getUserIdForExam(criteria.examId);
        return studentRepository.findOneOrFail({
            where: {
                email: criteria.email.trim().toLowerCase(),
                group: { user: { id: examUserId } },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                group: { id: true, user: { id: true } },
            },
            relations: ['group', 'group.user'],
        });
    }

    async function createStudents(criteria: { groupId: Group['id'] }, emails: string[]) {
        const { groupId } = criteria;

        const groupService = buildGroupService();
        const group = await groupService.getGroup(groupId);
        const students = emails.map((email) => {
            const student = new Student();
            student.email = email.trim().toLowerCase();
            student.group = group;
            return student;
        });
        return studentRepository.upsert(students, ['email', 'group']);
    }

    async function deleteStudent(studentId: Student['id']) {
        const result = await studentRepository.delete({ id: studentId });
        return result.affected == 1;
    }

    async function bulkInsertStudents(students: Array<Student>) {
        return studentRepository.insert(students);
    }

    async function changeGroup(
        criteria: { studentId: Student['id'] },
        body: { newGroupId: Group['id'] },
    ) {
        const groupService = buildGroupService();
        const group = await groupService.getGroup(body.newGroupId);
        const result = await studentRepository.update({ id: criteria.studentId }, { group });
        return result.affected === 1;
    }
}
