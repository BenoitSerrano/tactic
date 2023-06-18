import { attemptAdaptator } from './attempt.adaptator';

const attempt = {
    id: '6d7a8f5c-a848-4693-bf07-1df75be5b671',
    createdAt: '2023-06-15T17:16:20.542Z',
    exam: {
        id: '72b9473b-4243-41b2-9793-2a2bd1a69a24',
        name: 'Test B2 groupe 1',
        questionsChoixMultiple: [
            {
                id: 1,
                title: 'My name is',
                possibleAnswers: ['John', 'Jack', 'Truc', 'Machin'],
                rightAnswerIndex: 1,
                order: 0,
            },
            {
                id: 2,
                title: 'United',
                possibleAnswers: ['Kingdom', 'land', 'headquarters', 'truc'],
                rightAnswerIndex: 0,
                order: 1,
            },
        ],
    },
    qcmAnswers: [
        {
            id: 3,
            choice: 3,
            questionChoixMultiple: {
                id: 1,
                title: 'My name is',
                possibleAnswers: ['John', 'Jack', 'Truc', 'Machin'],
                rightAnswerIndex: 1,
                order: 0,
            },
        },
        {
            id: 4,
            choice: 0,
            questionChoixMultiple: {
                id: 2,
                title: 'United',
                possibleAnswers: ['Kingdom', 'land', 'headquarters', 'truc'],
                rightAnswerIndex: 0,
                order: 1,
            },
        },
    ],
};

describe('examAdaptator', () => {
    it('should extract student marks from database', () => {
        const attemptWithAnswers = attemptAdaptator.convertAttemptToAttemptWithChoices(attempt);

        expect(attemptWithAnswers).toEqual({
            id: '6d7a8f5c-a848-4693-bf07-1df75be5b671',
            createdAt: '2023-06-15T17:16:20.542Z',
            exam: {
                id: '72b9473b-4243-41b2-9793-2a2bd1a69a24',
                name: 'Test B2 groupe 1',
                questionsChoixMultiple: [
                    {
                        id: 1,
                        title: 'My name is',
                        possibleAnswers: ['John', 'Jack', 'Truc', 'Machin'],
                        rightAnswerIndex: 1,
                        order: 0,
                        choice: 3,
                    },
                    {
                        id: 2,
                        title: 'United',
                        possibleAnswers: ['Kingdom', 'land', 'headquarters', 'truc'],
                        rightAnswerIndex: 0,
                        order: 1,
                        choice: 0,
                    },
                ],
            },
        });
    });
});
