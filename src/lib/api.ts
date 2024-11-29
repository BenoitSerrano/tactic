import { Attempt } from '../modules/attempt';
import { Exam } from '../modules/exam';
import { Classe } from '../modules/classe';
import { Student } from '../modules/student';
import { User } from '../modules/user';
import { UserConfiguration } from '../modules/userConfiguration';
import { writeFile, readFile } from 'fs/promises';
import { Establishment } from '../modules/establishment';
import { Package } from '../modules/package';

const api = {
    fetchAllExams,
    fetchAllEstablishments,
    fetchAllAttempts,
    fetchAllStudents,
    fetchAllClasses,
    fetchAllUsers,
    fetchAllUserConfigurations,
    fetchAllPackages,
};

async function saveJson(filename: string, data: Object) {
    return writeFile(`./local/${filename}.json`, JSON.stringify(data), { flag: 'w+' });
}

async function getJson<entityT>(filename: string) {
    try {
        const file = await readFile(`./local/${filename}.json`);
        return JSON.parse(file.toString()) as entityT[];
    } catch (error) {
        return undefined;
    }
}

async function fetchAllExams(): Promise<Exam[]> {
    const exams = await getJson<Exam>('exams');
    if (exams) {
        return exams;
    }
    const URL = `https://tactic-app.fr/api/all-exams`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('exams', parsedData);

    return parsedData;
}

async function fetchAllPackages(): Promise<Package[]> {
    const packages = await getJson<Package>('packages');
    if (packages) {
        return packages;
    }
    const URL = `https://tactic-app.fr/api/all-packages`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('packages', parsedData);

    return parsedData;
}

async function fetchAllEstablishments(): Promise<Establishment[]> {
    const establishments = await getJson<Establishment>('establishments');
    if (establishments) {
        return establishments;
    }
    const URL = `https://tactic-app.fr/api/all-establishments`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('establishments', parsedData);

    return parsedData;
}

async function fetchAllUsers(): Promise<User[]> {
    const users = await getJson<User>('users');
    if (users) {
        return users;
    }
    const URL = `https://tactic-app.fr/api/all-users`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('users', parsedData);

    return parsedData;
}

async function fetchAllUserConfigurations(): Promise<UserConfiguration[]> {
    const userConfigurations = await getJson<UserConfiguration>('userConfigurations');
    if (userConfigurations) {
        return userConfigurations;
    }
    const URL = `https://tactic-app.fr/api/all-user-configurations`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('userConfigurations', parsedData);

    return parsedData;
}

async function fetchAllStudents(): Promise<Student[]> {
    const students = await getJson<Student>('students');
    if (students) {
        return students;
    }
    const URL = `https://tactic-app.fr/api/all-students`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('students', parsedData);

    return parsedData;
}

async function fetchAllClasses(): Promise<Classe[]> {
    const classes = await getJson<Classe>('classes');
    if (classes) {
        return classes;
    }
    const URL = `https://tactic-app.fr/api/all-classes`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('classes', parsedData);

    return parsedData;
}

async function fetchAllAttempts(): Promise<Attempt[]> {
    const attempts = await getJson<Attempt>('attempts');
    if (attempts) {
        return attempts;
    }
    const URL = `https://tactic-app.fr/api/all-attempts`;

    const response = await fetch(URL);
    const parsedData = await response.json();
    await saveJson('attempts', parsedData);

    return parsedData;
}

export { api };
