type attemptWithoutAnswersType = {
    startedAt: string;
    exam: {
        duration: number;
        extraTime: number;
        name: string;
        questionsChoixMultiple: Array<questionChoixMultipleType>;
        questionsTrou: Array<questionTrouType>;
        phrasesMelangees: Array<phraseMelangeeType>;
    };
};

type questionChoixMultipleType = {
    id: number;
    title: string;
    possibleAnswers: string[];
    choice: number;
};

type questionTrouType = {
    id: number;
    beforeText: string;
    afterText: string;
    answer: string;
};

type phraseMelangeeType = {
    id: number;
    shuffledPhrase: string;
    answer: string;
};

export type {
    attemptWithoutAnswersType,
    phraseMelangeeType,
    questionChoixMultipleType,
    questionTrouType,
};
