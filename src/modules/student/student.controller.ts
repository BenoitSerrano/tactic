import { User } from '../user';
import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudents,
        patchStudent,
        getStudentsWithAttempts,
        fetchStudentByEmail,
        deleteStudent,
        deleteAllStudents,
    };

    return studentController;

    async function createStudents(params: { body: { emails: string[] } }, user?: User) {
        return studentService.createStudents(params.body.emails, user);
    }

    async function patchStudent(params: {
        urlParams: { studentId: string };
        body: { comment: string };
    }) {
        return studentService.patchStudent(params.urlParams.studentId, {
            comment: params.body.comment,
        });
    }

    async function getStudentsWithAttempts(_params: {}, user?: User) {
        return studentService.getStudentsWithAttempts(user);
    }

    async function fetchStudentByEmail(params: { urlParams: { email: string } }) {
        return studentService.fetchStudentByEmail(params.urlParams.email);
    }

    async function deleteStudent(params: { urlParams: { studentId: string } }) {
        return studentService.deleteStudent(params.urlParams.studentId);
    }

    async function deleteAllStudents(_params: {}, user?: User) {
        return studentService.deleteAllStudents(user?.id);
    }
}
