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
        getStudentByEmailForExam,
        deleteStudent,
        updateStudentClasse,
        getAllStudents,
        countStudentByClasse,
    };

    return studentController;

    async function countStudentByClasse(params: { urlParams: { classeId: Classe['id'] } }) {
        return studentService.countStudentByClasse(params.urlParams.classeId);
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

    async function getStudentByEmailForExam(params: {
        urlParams: { email: string; examId: string };
    }) {
        //TODO add controll ASSERT IS STUDENT ALLOWED TO EXAM
        return studentService.getStudentByEmailForExam({
            email: params.urlParams.email,
            examId: params.urlParams.examId,
        });
    }

    async function deleteStudent(params: { urlParams: { studentId: string } }) {
        return studentService.deleteStudent(params.urlParams.studentId);
    }

    async function updateStudentClasse(params: {
        urlParams: { studentId: string; newClasseId: string };
    }) {
        return studentService.updateStudentClasse(
            { studentId: params.urlParams.studentId },
            { newClasseId: params.urlParams.newClasseId },
        );
    }
}
