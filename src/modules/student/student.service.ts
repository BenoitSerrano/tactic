import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { User } from '../user';
import { Student } from './Student.entity';
import { studentAdaptator } from './student.adaptator';
import { mapEntities } from '../../lib/mapEntities';
import { hasher } from '../../lib/hasher';
import { Exam, buildExamService } from '../exam';
import { Group } from '../group';
import { buildGroupService } from '../group/group.service';

export { buildStudentService };

function buildStudentService() {
    const studentRepository = dataSource.getRepository(Student);

    const studentService = {
        patchStudent,
        createStudents,
        getStudents,
        getAllAnonymizedStudents,
        getStudentsWithAttempts,
        fetchStudentByEmail,
        deleteStudent,
        bulkInsertStudents,
    };

    return studentService;

    async function getStudentsWithAttempts(groupId: Group['id'], user?: User) {
        if (!user) {
            // TODO
            return [];
        }
        const studentsWithAttempts = await studentRepository.find({
            where: { user, group: { id: groupId } },
            select: {
                attempts: {
                    id: true,
                    startedAt: true,
                    endedAt: true,
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
        const studentsSummary = studentAdaptator.formatStudentsIntoStudentsSummary(
            studentsWithAttempts,
            exams,
        );
        return studentsSummary;
    }

    async function getStudents(studentIds: Student['id'][]) {
        const students = await studentRepository.find({
            where: { id: In(studentIds) },
            select: { id: true, email: true },
        });
        return students.reduce((acc, student) => {
            return { ...acc, [student.id]: student };
        }, {} as Record<string, Student>);
    }

    async function getAllAnonymizedStudents() {
        const students = await studentRepository.find({
            relations: ['user'],
            select: { user: { id: true } },
        });

        return mapEntities(
            students.map((student) => ({ ...student, email: hasher.hash(student.email) })),
        );
    }

    async function fetchStudentByEmail(email: string) {
        return studentRepository.findOneOrFail({
            where: { email: email.trim().toLowerCase() },
            select: { id: true, attempts: { id: true, exam: { id: true } } },
            relations: ['attempts', 'attempts.exam'],
        });
    }

    async function createStudents(
        criteria: { user?: User; groupId: Group['id'] },
        emails: string[],
    ) {
        const { user, groupId } = criteria;
        if (!user) {
            // TODO

            return;
        }
        const groupService = buildGroupService();
        const group = await groupService.getGroup(groupId);
        const students = emails.map((email) => {
            const student = new Student();
            student.email = email.trim().toLowerCase();
            student.user = user;
            student.group = group;
            return student;
        });
        return studentRepository.upsert(students, ['email', 'user']);
    }

    async function patchStudent(studentId: Student['id'], { comment }: { comment: string }) {
        const result = await studentRepository.update({ id: studentId }, { comment });
        return result.affected == 1;
    }

    async function deleteStudent(studentId: Student['id']) {
        const result = await studentRepository.delete({ id: studentId });
        return result.affected == 1;
    }

    async function bulkInsertStudents(students: Array<Student>) {
        return studentRepository.insert(students);
    }
}
