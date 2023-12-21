import { Attempt } from '../modules/attempt';
import { Exam } from '../modules/exam';
import { Group } from '../modules/group';
import { Student } from '../modules/student';

const api = {
    fetchAllExams,
    fetchAllAttempts,
    fetchAllStudents,
    fetchAllGroups,
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

async function fetchAllGroups(): Promise<Group[]> {
    const URL = `https://tactic-app.fr/api/all-groups`;

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
