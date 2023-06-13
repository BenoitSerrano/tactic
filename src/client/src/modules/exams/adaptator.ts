const examAdaptator = {
    fetchQuestions,
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

function fetchQuestions() {
    return questions;
}

export { examAdaptator };
