import { examAdaptator } from './exam.adaptator';

describe('examAdaptator', () => {
    it('should extract student marks from database with QCM', () => {
        const examWithAttemptsQcm = {
            id: '0169f886-6fb5-46b5-a258-9afb7491bb6c',
            name: "Test d'examen",
            questionsTrou: [],
            attempts: [
                {
                    id: 'e056210f-19a7-4e85-9c99-d29c8b6410ee',
                    startedAt: '2023-06-15T15:05:39.616Z',
                    updatedAt: '2023-06-15T15:15:39.616Z',
                    student: {
                        id: 'edf0f1b0-d6a5-4603-b7e3-805828e76f72',
                        email: 'soeren.larsen@truc.machin',
                    },
                    questionTrouAnswers: [],
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
                                possibleAnswers: [
                                    'Professeur Layton',
                                    'Lisa',
                                    'Gloire et Beauté',
                                    'D',
                                ],
                                rightAnswerIndex: 1,
                                order: 1,
                            },
                        },
                    ],
                },
                {
                    id: 'ff199468-6420-41ef-b15e-bca4138fae4d',
                    startedAt: '2023-06-15T15:06:04.122Z',
                    updatedAt: undefined,
                    student: {
                        id: '20d07fd1-16f8-4131-a73c-03fc099a8330',
                        email: 'theobald.beltran@truc.machin',
                    },
                    questionTrouAnswers: [],
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
                                possibleAnswers: [
                                    'Professeur Layton',
                                    'Lisa',
                                    'Gloire et Beauté',
                                    'D',
                                ],
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

        const examResults = examAdaptator.convertExamWithAttemptsToResults(
            examWithAttemptsQcm as any,
        );

        expect(examResults).toEqual([
            {
                id: 'edf0f1b0-d6a5-4603-b7e3-805828e76f72',
                email: 'soeren.larsen@truc.machin',
                startedAt: 1686841539616,
                duration: 600,
                attemptId: 'e056210f-19a7-4e85-9c99-d29c8b6410ee',
                qcmSummary: {
                    '12': {
                        choice: 1,
                        status: 'wrong',
                    },
                    '13': {
                        choice: 0,
                        status: 'wrong',
                    },
                },
                questionTrouSummary: {},
            },
            {
                id: '20d07fd1-16f8-4131-a73c-03fc099a8330',
                startedAt: 1686841564122,
                duration: undefined,
                email: 'theobald.beltran@truc.machin',
                attemptId: 'ff199468-6420-41ef-b15e-bca4138fae4d',
                qcmSummary: {
                    '12': {
                        choice: 2,
                        status: 'right',
                    },
                    '13': {
                        choice: 1,
                        status: 'right',
                    },
                },
                questionTrouSummary: {},
            },
        ]);
    });

    it('should extract student marks from database with QCM', () => {
        const examWithAttemptsQuestionTrou = {
            id: '7ee608ed-5cc3-4f86-9e5a-79152c4a5623',
            name: 'Texte à trou',
            duration: 120,
            extraTime: 2,
            attempts: [
                {
                    id: 'a7ff95b3-e0de-4757-91de-1edef2a30224',
                    startedAt: '2023-06-20T20:17:45.661Z',
                    updatedAt: '2023-06-20T20:28:45.661Z',
                    student: {
                        id: '1da8c428-23fd-468a-9caa-c2d989dd643e',
                        email: 'chiara.atamea@proton.me',
                    },
                    qcmAnswers: [],
                    questionTrouAnswers: [
                        {
                            id: 1,
                            answer: 'rencontren',
                            questionTrou: {
                                id: 1,
                                beforeText: 'Ils',
                                afterText:
                                    '(rencontrer) leur voisine tous les jours à la boulangerie.',
                                acceptableAnswers: [],
                                rightAnswers: ['rencontrent'],
                                order: 0,
                            },
                        },
                        {
                            id: 6,
                            answer: 'du',
                            questionTrou: {
                                id: 3,
                                beforeText: 'Est-ce que vous faites',
                                afterText: 'sport ?',
                                acceptableAnswers: [],
                                rightAnswers: ['du'],
                                order: 2,
                            },
                        },
                        {
                            id: 10,
                            answer: 'vais',
                            questionTrou: {
                                id: 2,
                                beforeText: 'En général, je',
                                afterText: '(aller) au cinéma deux fois par mois.',
                                acceptableAnswers: [],
                                rightAnswers: ['vais'],
                                order: 1,
                            },
                        },
                    ],
                },
            ],
            questionsChoixMultiple: [],
            questionsTrou: [
                {
                    id: 1,
                    beforeText: 'Ils',
                    afterText: '(rencontrer) leur voisine tous les jours à la boulangerie.',
                    acceptableAnswers: [],
                    rightAnswers: ['rencontrent'],
                    order: 0,
                },
                {
                    id: 3,
                    beforeText: 'Est-ce que vous faites',
                    afterText: 'sport ?',
                    acceptableAnswers: [],
                    rightAnswers: ['du'],
                    order: 2,
                },
                {
                    id: 2,
                    beforeText: 'En général, je',
                    afterText: '(aller) au cinéma deux fois par mois.',
                    acceptableAnswers: [],
                    rightAnswers: ['vais'],
                    order: 1,
                },
            ],
        };

        const examResults = examAdaptator.convertExamWithAttemptsToResults(
            examWithAttemptsQuestionTrou as any,
        );
        expect(examResults).toEqual([
            {
                id: '1da8c428-23fd-468a-9caa-c2d989dd643e',
                email: 'chiara.atamea@proton.me',
                startedAt: 1687292265661,
                duration: 660,
                attemptId: 'a7ff95b3-e0de-4757-91de-1edef2a30224',
                qcmSummary: {},
                questionTrouSummary: {
                    '1': {
                        answer: 'rencontren',
                        status: 'wrong',
                    },
                    '2': {
                        answer: 'vais',
                        status: 'right',
                    },
                    '3': {
                        answer: 'du',
                        status: 'right',
                    },
                },
            },
        ]);
    });
});
