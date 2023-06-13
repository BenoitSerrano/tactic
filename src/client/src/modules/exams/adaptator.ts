import { examType, trialType } from '../../types';

const examAdaptator = buildExamAdaptator();

function buildExamAdaptator() {
    const exams: examType[] = [
        {
            id: 'mon-examen',
            questions: [
                {
                    id: 'truc',
                    title: 'How old are you? I ________',
                    possibleAnswers: ['have 30', 'have 30 years', 'am 30 years', 'am 30 years old'],
                },
                {
                    id: 'machin',
                    title: 'Please, _________ you speak slower?',
                    possibleAnswers: ['could', 'will', 'do', 'are'],
                },

                {
                    id: 'bidule',
                    title: 'London is the capital of the United ________ .',
                    possibleAnswers: ['country', 'land', 'headquarters', 'Kingdom'],
                },
            ],
            solution: { truc: 3, machin: 0, bidule: 3 },
        },
    ];

    return {
        findExam,
        fetchQuestions,
        computeScore,
        getSolution,
    };

    function findExam(examId: string) {
        const exam = exams.find(({ id }) => id === examId);
        if (!exam) {
            throw new Error(`L'examId ${examId} ne correspond à aucun examen`);
        }
        return exam;
    }

    function fetchQuestions(examId: string) {
        const exam = findExam(examId);
        return exam.questions;
    }
    function computeScore(examId: string, trial: trialType) {
        const exam = findExam(examId);

        return Object.keys(trial).reduce((acc, questionId) => {
            const value = trial[questionId] === exam.solution[questionId] ? 1 : 0;
            return acc + value;
        }, 0);
    }
    function getSolution(examId: string) {
        const exam = findExam(examId);

        return exam.solution;
    }
}

export { examAdaptator };
