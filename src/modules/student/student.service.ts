import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { User } from '../user';
import { Student } from './Student.entity';
import { studentAdaptator } from './student.adaptator';
import { mapEntities } from '../../lib/mapEntities';
import { hasher } from '../../lib/hasher';

export { buildStudentService };

function buildStudentService() {
    const studentRepository = dataSource.getRepository(Student);

    const studentService = {
        patchStudent,
        createStudents,
        getStudents,
        getAllAnonymizedStudents,
        getStudentsWithAttempts,
        getStudentId,
        deleteStudent,
        bulkInsertStudents,
        deleteAllStudents,
    };

    return studentService;

    async function getStudentsWithAttempts(user?: User) {
        const studentsWithAttempts = await studentRepository.find({
            where: { user },
            select: { attempts: { id: true, exam: { id: true, name: true } } },
            relations: ['attempts', 'attempts.exam'],
        });
        const studentsSummary =
            studentAdaptator.formatStudentsIntoStudentsSummary(studentsWithAttempts);
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

    async function getStudentId(email: string) {
        return studentRepository.findOneOrFail({
            where: { email: email.trim().toLowerCase() },
            select: ['id'],
        });
    }

    async function createStudents(emails: string[], user?: User) {
        const students = emails.map((email) => {
            const student = new Student();
            student.email = email.trim().toLowerCase();
            student.user = user;
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
    async function deleteAllStudents(userId: User['id'] | undefined) {
        if (!userId) {
            return;
        }
        return studentRepository.delete({ user: { id: userId } });
    }

    async function bulkInsertStudents(students: Array<Student>) {
        return studentRepository.insert(students);
    }
}
