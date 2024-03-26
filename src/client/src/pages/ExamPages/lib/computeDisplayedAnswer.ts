import { TEXTE_A_TROU_REGEX } from '../../../constants';
import { gradeConverter } from '../../../lib/gradeConverter';
import { sanitizer } from '../../../lib/sanitizer';
import { acceptableAnswerType, gradeType } from '../../../types';
import { answerStatusType, questionWithAnswersType } from '../types';
import { SPLITTING_CHARACTER_FOR_TAT } from './converter';

type chunkType =
    | { kind: 'text'; value: string }
    | {
          kind: 'coloredText';
          value: string;
          status: answerStatusType;
          grade: gradeType | undefined;
      };
type displayedAnswerType = {
    title: Array<chunkType>;
    answer: Array<chunkType> | undefined;
    displayedRightAnswers: string[];
};

function computeDisplayedAnswer(
    question: questionWithAnswersType,
    answerStatus: answerStatusType,
): displayedAnswerType {
    if (question.kind === 'texteLibre') {
        return {
            title: [{ kind: 'text', value: question.title }],
            answer: [
                {
                    kind: 'coloredText',
                    value: question.answer || '',
                    status: answerStatus,
                    grade: question.grade,
                },
            ],
            displayedRightAnswers: [],
        };
    }
    const rightAnswers = extractRightAnswers(question.acceptableAnswers);

    switch (question.kind) {
        case 'questionReponse':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: question.answer || '',
                        status: answerStatus,
                        grade: question.grade,
                    },
                ],
                displayedRightAnswers: rightAnswers[0],
            };
        case 'texteATrous':
            let displayedRightAnswer = '';
            const tATRegexMatch = question.title.matchAll(TEXTE_A_TROU_REGEX);
            let value = tATRegexMatch.next();
            // const displayedRightAnswers: string[] = [];
            if (!!value.done) {
                console.error(`texte à trous wrongly formatted: ${question.title}`);
                return {
                    title: [{ kind: 'text', value: question.title }],
                    answer: undefined,
                    displayedRightAnswers: [],
                };
            }

            const answers = question.answer
                ? question.answer.split(SPLITTING_CHARACTER_FOR_TAT)
                : SPLITTING_CHARACTER_FOR_TAT.repeat(question.acceptableAnswers.length).split(
                      SPLITTING_CHARACTER_FOR_TAT,
                  );
            const title: Array<chunkType> = [];
            let lastIndexFound = 0;
            let blankIndex = 0;
            while (!value.done) {
                const titleSlice = question.title.slice(lastIndexFound, value.value.index);
                title.push({
                    kind: 'text',
                    value: titleSlice.trim(),
                });

                displayedRightAnswer += titleSlice;

                const acceptableAnswersForBlank = question.acceptableAnswers[blankIndex];
                const matchingAcceptableAnswer = acceptableAnswersForBlank.find(
                    (acceptableAnswerForBlank) =>
                        sanitizer.sanitizeString(answers[blankIndex]) ===
                        sanitizer.sanitizeString(acceptableAnswerForBlank.answer),
                );

                const blankStatus = gradeConverter.convertGradeToStatus(
                    matchingAcceptableAnswer?.grade,
                );

                title.push({
                    kind: 'coloredText',
                    value: answers[blankIndex] || '....',
                    status: blankStatus,
                    grade: matchingAcceptableAnswer?.grade || 'E',
                });
                displayedRightAnswer += rightAnswers[blankIndex].join(' / ');
                lastIndexFound = (value.value.index || 0) + 4;
                value = tATRegexMatch.next();
                blankIndex++;
            }
            if (lastIndexFound < question.title.length - 1) {
                const sliceTitle = question.title.slice(lastIndexFound);
                title.push({ kind: 'text', value: sliceTitle.trim() });
                displayedRightAnswer += sliceTitle;
            }
            return {
                title,
                answer: undefined,
                displayedRightAnswers: [displayedRightAnswer],
            };
        case 'phraseMelangee':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: question.answer || '',
                        status: answerStatus,
                        grade: question.grade,
                    },
                ],
                displayedRightAnswers: rightAnswers[0],
            };
        case 'qcm':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: question.answer
                            ? question.possibleAnswers[Number(question.answer)]
                            : '',
                        status: answerStatus,
                        grade: question.grade,
                    },
                ],
                displayedRightAnswers: rightAnswers[0].map(
                    (rightAnswer) => question.possibleAnswers[Number(rightAnswer)],
                ),
            };
    }
}

function extractRightAnswers(acceptableAnswers: acceptableAnswerType[][]): string[][] {
    if (acceptableAnswers.length === 0) {
        console.error(`acceptableAnswers length is ${acceptableAnswers.length}`);
        return [];
    }
    return acceptableAnswers.map((acceptableAnswersForBlank) =>
        acceptableAnswersForBlank
            .filter((acceptableAnswer) => acceptableAnswer.grade === 'A')
            .map((acceptableAnswer) => acceptableAnswer.answer),
    );
}

export { computeDisplayedAnswer };
export type { displayedAnswerType };
