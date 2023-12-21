import { User } from '../user';
import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudents,
        getStudentsWithAttempts,
        fetchStudentByEmailForExam,
        deleteStudent,
        changeGroup,
        getAllStudents,
    };

    return studentController;

    async function getAllStudents() {
        return studentService.getAllStudents();
    }

    async function createStudents(params: {
        urlParams: { groupId: string };
        body: { emails: string[] };
    }) {
        return studentService.createStudents(
            { groupId: params.urlParams.groupId },
            params.body.emails,
        );
    }

    async function getStudentsWithAttempts(params: { urlParams: { groupId: string } }) {
        return studentService.getStudentsWithAttempts(params.urlParams.groupId);
    }

    async function fetchStudentByEmailForExam(params: {
        urlParams: { email: string; examId: string };
    }) {
        return studentService.fetchStudentByEmailForExam({
            email: params.urlParams.email,
            examId: params.urlParams.examId,
        });
    }

    async function deleteStudent(params: { urlParams: { studentId: string } }) {
        return studentService.deleteStudent(params.urlParams.studentId);
    }

    async function changeGroup(params: { urlParams: { studentId: string; newGroupId: string } }) {
        return studentService.changeGroup(
            { studentId: params.urlParams.studentId },
            { newGroupId: params.urlParams.newGroupId },
        );
    }
}
