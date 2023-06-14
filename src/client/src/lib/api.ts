import { config } from '../config';

const api = {
    createExam,
    fetchExams,
};

const BASE_URL = `${config.API_URL}/api`;

async function fetchExams() {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

async function createExam(name: string) {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
    });
    return response.json();
}

export { api };
