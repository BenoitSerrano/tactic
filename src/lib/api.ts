import { Exam } from '../modules/exam';

const api = {
    fetchAllExams,
};

async function fetchAllExams(): Promise<Exam[]> {
    const URL = `https://tactic-app.fr/api/all-exams`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    return parsedData;
}

export { api };
