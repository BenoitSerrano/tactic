const examAdaptator = {
    fetchQuestions,
    computeScore,
};

const questions = [
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
];

const solution: trialType = { truc: 3, machin: 0, bidule: 3 };

function fetchQuestions() {
    return questions;
}
type trialType = Record<string, number>;

function computeScore(trial: trialType) {
    return Object.keys(trial).reduce((acc, questionId) => {
        const value = trial[questionId] === solution[questionId] ? 1 : 0;
        return acc + value;
    }, 0);
}

export { examAdaptator };
