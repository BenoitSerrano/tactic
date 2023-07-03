import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudent,
        createStudents,
        patchStudent,
        getStudentsWithAttempts,
        getStudentId,
        deleteStudent,
    };

    return studentController;

    async function createStudent(params: { body: { email: string } }) {
        return studentService.createStudent(params.body.email);
    }

    async function createStudents(params: { body: { emails: string[] } }) {
        return studentService.createStudents(params.body.emails);
    }

    async function patchStudent(params: {
        urlParams: { studentId: string };
        body: { comment: string };
    }) {
        return studentService.patchStudent(params.urlParams.studentId, {
            comment: params.body.comment,
        });
    }

    async function getStudentsWithAttempts() {
        return studentService.getStudentsWithAttempts();
    }

    async function getStudentId(params: { urlParams: { email: string } }) {
        return studentService.getStudentId(params.urlParams.email);
    }

    async function deleteStudent(params: { urlParams: { studentId: string } }) {
        return studentService.deleteStudent(params.urlParams.studentId);
    }
}
