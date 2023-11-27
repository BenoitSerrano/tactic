import { User } from '../user';
import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudents,
        getStudentsWithAttempts,
        fetchStudentByEmail,
        deleteStudent,
        changeGroup,
    };

    return studentController;

    async function createStudents(
        params: { urlParams: { groupId: string }; body: { emails: string[] } },
        user?: User,
    ) {
        return studentService.createStudents(
            { user, groupId: params.urlParams.groupId },
            params.body.emails,
        );
    }

    async function getStudentsWithAttempts(
        params: { urlParams: { groupId: string } },
        user?: User,
    ) {
        return studentService.getStudentsWithAttempts(params.urlParams.groupId, user);
    }

    async function fetchStudentByEmail(params: { urlParams: { email: string } }) {
        return studentService.fetchStudentByEmail(params.urlParams.email);
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
