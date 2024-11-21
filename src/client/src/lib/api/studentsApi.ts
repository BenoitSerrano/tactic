import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const studentsApi = {
    getStudent,
    getStudentsWithAttempts,
    getStudentByEmailForExam,
    countStudentsByClasse,
    updateStudentNames,
    updateStudentClasse,
    createStudents,
    deleteStudent,
};

async function getStudent(params: { studentId: string }) {
    const URL = `${BASE_URL}/students/${params.studentId}`;
    return performApiCall(URL, 'GET');
}

async function getStudentsWithAttempts(params: { classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students/with-attempts`;
    return performApiCall(URL, 'GET');
}

async function getStudentByEmailForExam(params: { email: string; examId: string }) {
    const URL = `${BASE_URL}/exams/${params.examId}/students/${params.email}`;
    return performApiCall(URL, 'GET');
}

async function countStudentsByClasse(classeId: string): Promise<{ studentsCount: number }> {
    const URL = `${BASE_URL}/classes/${classeId}/students-count`;
    return performApiCall(URL, 'GET');
}

async function updateStudentNames(params: {
    studentId: string;
    firstName?: string;
    lastName?: string;
}) {
    const URL = `${BASE_URL}/students/${params.studentId}/names`;
    return performApiCall(URL, 'PATCH', { firstName: params.firstName, lastName: params.lastName });
}

async function updateStudentClasse(params: {
    classeId: string;
    studentId: string;
    newClasseId: string;
}) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students/${params.studentId}/new-classe/${params.newClasseId}`;
    return performApiCall(URL, 'PATCH');
}

async function createStudents(params: { emails: string[]; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students`;
    return performApiCall(URL, 'POST', { emails: params.emails });
}

async function deleteStudent(params: { studentId: string; classeId: string }) {
    const URL = `${BASE_URL}/classes/${params.classeId}/students/${params.studentId}`;
    return performApiCall(URL, 'DELETE');
}

export { studentsApi };
