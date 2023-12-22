import { TEXTE_A_TROU_REGEX } from '../../../constants';
import { sanitizer } from '../../../lib/sanitizer';
import { answerStatusType, questionWithAnswersType } from '../types';
import { SPLITTING_CHARACTER_FOR_TAT } from './converter';

type chunkType =
    | { kind: 'text'; value: string }
    | { kind: 'coloredText'; value: string; status: answerStatusType };
type displayedAnswerType = { title: Array<chunkType>; answer: Array<chunkType> | undefined };

function computeDisplayedAnswer(
    question: questionWithAnswersType,
    answerStatus: answerStatusType,
): displayedAnswerType {
    switch (question.kind) {
        case 'questionReponse':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    { kind: 'coloredText', value: question.answer || '', status: answerStatus },
                ],
            };
        case 'texteATrous':
            const tATRegexMatch = question.title.matchAll(TEXTE_A_TROU_REGEX);
            let value = tATRegexMatch.next();
            if (!!value.done) {
                return { title: [{ kind: 'text', value: question.title }], answer: undefined };
            }

            const answers = question.answer
                ? question.answer.split(SPLITTING_CHARACTER_FOR_TAT)
                : SPLITTING_CHARACTER_FOR_TAT.repeat(question.acceptableAnswers.length).split(
                      SPLITTING_CHARACTER_FOR_TAT,
                  );
            const title: Array<chunkType> = [];
            let lastIndexFound = 0;
            let answerIndex = 0;
            while (!value.done) {
                title.push({
                    kind: 'text',
                    value: question.title.slice(lastIndexFound, value.value.index).trim(),
                });

                const acceptableAnswer = question.acceptableAnswers[answerIndex];

                title.push({
                    kind: 'coloredText',
                    value: answers[answerIndex] || '....',
                    status:
                        sanitizer.sanitizeString(answers[answerIndex]) === acceptableAnswer.answer
                            ? 'right'
                            : 'wrong',
                });
                lastIndexFound = (value.value.index || 0) + 4;
                value = tATRegexMatch.next();
                answerIndex++;
            }
            if (lastIndexFound < question.title.length - 1) {
                title.push({ kind: 'text', value: question.title.slice(lastIndexFound).trim() });
            }
            return { title, answer: undefined };
        case 'texteLibre':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    { kind: 'coloredText', value: question.answer || '', status: answerStatus },
                ],
            };
        case 'phraseMelangee':
            return {
                title: [{ kind: 'text', value: question.title }],
                answer: [
                    { kind: 'coloredText', value: question.answer || '', status: answerStatus },
                ],
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
                    },
                ],
            };
    }

    return { title: [], answer: undefined };
}

export { computeDisplayedAnswer };
