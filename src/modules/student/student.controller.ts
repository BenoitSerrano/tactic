import { Classe } from '../classe';
import { User } from '../user';
import { buildStudentService } from './student.service';

export { buildStudentController };

function buildStudentController() {
    const studentService = buildStudentService();
    const studentController = {
        createStudents,
        getStudent,
        updateStudentNames,
        getStudentsWithAttempts,
        fetchStudentByEmailForExam,
        deleteStudent,
        changeClasse,
        getAllStudents,
        countStudentForClasse,
    };

    return studentController;

    async function countStudentForClasse(params: { urlParams: { classeId: Classe['id'] } }) {
        return studentService.countStudentForClasse(params.urlParams.classeId);
    }

    async function getAllStudents() {
        return studentService.getAllStudents();
    }

    async function createStudents(params: {
        urlParams: { classeId: string };
        body: { emails: string[] };
    }) {
        return studentService.createStudents(
            { classeId: params.urlParams.classeId },
            params.body.emails,
        );
    }

    async function getStudentsWithAttempts(params: { urlParams: { classeId: string } }) {
        return studentService.getStudentsWithAttempts(params.urlParams.classeId);
    }

    async function getStudent(params: { urlParams: { studentId: string } }) {
        return studentService.getStudent(params.urlParams.studentId);
    }

    async function updateStudentNames(params: {
        urlParams: { studentId: string };
        body: { firstName?: string; lastName?: string };
    }) {
        return studentService.updateStudentNames(params.urlParams.studentId, params.body);
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

    async function changeClasse(params: { urlParams: { studentId: string; newClasseId: string } }) {
        return studentService.changeClasse(
            { studentId: params.urlParams.studentId },
            { newClasseId: params.urlParams.newClasseId },
        );
    }
}
