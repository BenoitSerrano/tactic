import { Attempt } from '../modules/attempt';
import { Exam } from '../modules/exam';
import { Classe } from '../modules/classe';
import { Student } from '../modules/student';

const api = {
    fetchAllExams,
    fetchAllAttempts,
    fetchAllStudents,
    fetchAllClasses,
};

async function fetchAllExams(): Promise<Exam[]> {
    const URL = `https://tactic-app.fr/api/all-exams`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    return parsedData;
}

async function fetchAllStudents(): Promise<Student[]> {
    const URL = `https://tactic-app.fr/api/all-students`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    return parsedData;
}

async function fetchAllClasses(): Promise<Classe[]> {
    const URL = `https://tactic-app.fr/api/all-classes`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    return parsedData;
}

async function fetchAllAttempts(): Promise<Attempt[]> {
    const URL = `https://tactic-app.fr/api/all-attempts`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    return parsedData;
}

export { api };
