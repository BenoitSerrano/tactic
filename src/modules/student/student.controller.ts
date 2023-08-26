import { User } from '../user';
import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudents,
        patchStudent,
        getStudentsWithAttempts,
        getStudentId,
        deleteStudent,
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

    async function getStudentId(params: { urlParams: { email: string } }) {
        return studentService.getStudentId(params.urlParams.email);
    }

    async function deleteStudent(params: { urlParams: { studentId: string } }) {
        return studentService.deleteStudent(params.urlParams.studentId);
    }
}
