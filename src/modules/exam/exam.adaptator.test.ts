import { examAdaptator } from './exam.adaptator';

const examWithAttempts = {
    id: '0169f886-6fb5-46b5-a258-9afb7491bb6c',
    name: "Test d'examen",
    attempts: [
        {
            id: 'e056210f-19a7-4e85-9c99-d29c8b6410ee',
            startedAt: '2023-06-15T15:05:39.616Z',
            endedAt: '2023-06-15T15:15:39.616Z',
            student: {
                id: 'edf0f1b0-d6a5-4603-b7e3-805828e76f72',
                email: 'soeren.larsen@truc.machin',
            },
            qcmAnswers: [
                {
                    id: 8,
                    choice: 1,
                    questionChoixMultiple: {
                        id: 12,
                        title: 'Le contraire de radis',
                        possibleAnswers: ['paradis', 'enfer', 'carotte', 'D'],
                        rightAnswerIndex: 2,
                        order: 0,
                    },
                },
                {
                    id: 9,
                    choice: 0,
                    questionChoixMultiple: {
                        id: 13,
                        title: 'Le destin de',
                        possibleAnswers: ['Professeur Layton', 'Lisa', 'Gloire et Beauté', 'D'],
                        rightAnswerIndex: 1,
                        order: 1,
                    },
                },
            ],
        },
        {
            id: 'ff199468-6420-41ef-b15e-bca4138fae4d',
            startedAt: '2023-06-15T15:06:04.122Z',
            endedAt: undefined,
            student: {
                id: '20d07fd1-16f8-4131-a73c-03fc099a8330',
                email: 'theobald.beltran@truc.machin',
            },
            qcmAnswers: [
                {
                    id: 10,
                    choice: 2,
                    questionChoixMultiple: {
                        id: 12,
                        title: 'Le contraire de radis',
                        possibleAnswers: ['paradis', 'enfer', 'carotte', 'D'],
                        rightAnswerIndex: 2,
                        order: 0,
                    },
                },
                {
                    id: 11,
                    choice: 1,
                    questionChoixMultiple: {
                        id: 13,
                        title: 'Le destin de',
                        possibleAnswers: ['Professeur Layton', 'Lisa', 'Gloire et Beauté', 'D'],
                        rightAnswerIndex: 1,
                        order: 1,
                    },
                },
            ],
        },
    ],
    questionsChoixMultiple: [
        {
            id: 13,
            title: 'Le destin de',
            possibleAnswers: ['Professeur Layton', 'Lisa', 'Gloire et Beauté', 'D'],
            rightAnswerIndex: 1,
            order: 1,
        },
        {
            id: 12,
            title: 'Le contraire de radis',
            possibleAnswers: ['paradis', 'enfer', 'carotte', 'D'],
            rightAnswerIndex: 2,
            order: 0,
        },
    ],
};

describe('examAdaptator', () => {
    it('should extract student marks from database', () => {
        const examResults = examAdaptator.convertExamWithAttemptsToResults(examWithAttempts);

        expect(examResults).toEqual([
            {
                id: 'edf0f1b0-d6a5-4603-b7e3-805828e76f72',
                email: 'soeren.larsen@truc.machin',
                startedAt: '2023-06-15T15:05:39.616Z',
                duration: 60,

                attemptId: 'e056210f-19a7-4e85-9c99-d29c8b6410ee',
                mark: 0,
                totalPoints: 2,
            },
            {
                id: '20d07fd1-16f8-4131-a73c-03fc099a8330',
                startedAt: '2023-06-15T15:06:04.122Z',
                duration: undefined,
                email: 'theobald.beltran@truc.machin',
                attemptId: 'ff199468-6420-41ef-b15e-bca4138fae4d',
                mark: 2,
                totalPoints: 2,
            },
        ]);
    });
});
