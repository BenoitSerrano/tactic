const examAdaptator = {
    fetch,
};

function fetch() {
    return [
        {
            question: 'How old are you? I ________',
            possibilities: ['have 30', 'have 30 years', 'am 30 years', 'am 30 years old'],
            answer: 3,
        },
        {
            question: 'Please, _________ you speak slower?',
            possibilities: ['could', 'will', 'do', 'are'],
            answer: 0,
        },

        {
            question: 'London is the capital of the United ________ .',
            possibilities: ['country', 'land', 'headquarters', 'Kingdom'],
            answer: 3,
        },
    ];
}

export { examAdaptator };
