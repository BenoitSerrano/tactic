import { In } from 'typeorm';
import { dataSource } from '../../dataSource';
import { User } from '../user';
import { Student } from './Student.entity';
import { studentAdaptator } from './student.adaptator';

export { buildStudentService };

function buildStudentService() {
    const studentService = {
        patchStudent,
        createStudents,
        getStudents,
        getStudentsWithAttempts,
        getStudentId,
        deleteStudent,
    };

    return studentService;

    async function getStudentsWithAttempts(user?: User) {
        const studentRepository = dataSource.getRepository(Student);
        const studentsWithAttempts = await studentRepository.find({
            where: { user },
            relations: ['attempts', 'attempts.exam'],
        });
        const studentsSummary =
            studentAdaptator.formatStudentsIntoStudentsSummary(studentsWithAttempts);
        return studentsSummary;
    }

    async function getStudents(studentIds: Student['id'][]) {
        const studentRepository = dataSource.getRepository(Student);

        const students = await studentRepository.find({
            where: { id: In(studentIds) },
            select: { id: true, email: true },
        });
        return students.reduce((acc, student) => {
            return { ...acc, [student.id]: student };
        }, {} as Record<string, Student>);
    }

    async function getStudentId(email: string) {
        const studentRepository = dataSource.getRepository(Student);
        return studentRepository.findOneOrFail({
            where: { email: email.trim().toLowerCase() },
            select: ['id'],
        });
    }

    async function createStudents(emails: string[], user?: User) {
        const studentRepository = dataSource.getRepository(Student);
        const students = emails.map((email) => {
            const student = new Student();
            student.email = email.trim().toLowerCase();
            student.user = user;
            return student;
        });
        return studentRepository.upsert(students, ['email', 'user']);
    }

    async function patchStudent(studentId: string, { comment }: { comment: string }) {
        const studentRepository = dataSource.getRepository(Student);

        const result = await studentRepository.update({ id: studentId }, { comment });
        return result.affected == 1;
    }

    async function deleteStudent(studentId: string) {
        const studentRepository = dataSource.getRepository(Student);

        const result = await studentRepository.delete({ id: studentId });
        return result.affected == 1;
    }
}
