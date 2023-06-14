import { config } from '../config';

const api = {
    getExams,
};

const BASE_URL = `${config.API_URL}/api`;

async function getExams() {
    const URL = `${BASE_URL}/exams`;
    const response = await fetch(URL, {
        method: 'GET',
    });
    return response.json();
}

export { api };
