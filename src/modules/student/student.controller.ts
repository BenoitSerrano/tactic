import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudent,
        getStudentsWithAttempts,
    };

    return studentController;

    async function createStudent(params: { body: { email: string } }) {
        return studentService.createStudent(params.body.email);
    }

    async function getStudentsWithAttempts() {
        return studentService.getStudentsWithAttempts();
    }
}
