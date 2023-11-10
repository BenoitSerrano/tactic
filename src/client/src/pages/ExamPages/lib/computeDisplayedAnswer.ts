import { QUESTION_TROU_REGEX, TEXTE_A_TROU_REGEX } from '../../../constants';
import { answerStatusType, questionType } from '../types';

type chunkType =
    | { kind: 'text'; value: string }
    | { kind: 'coloredText'; value: string; status: answerStatusType };
type displayedAnswerType = { title: Array<chunkType>; answer: Array<chunkType> | undefined };

function computeDisplayedAnswer(
    question: questionType,
    answerStatus: answerStatusType,
): displayedAnswerType {
    switch (question.kind) {
        case 'questionTrou':
            const QTRegexMatch = question.title.match(QUESTION_TROU_REGEX);
            if (!QTRegexMatch) {
                return { title: [{ kind: 'text', value: question.title }], answer: undefined };
            }
            // if (!question.answer) {
            //     return {
            //         title: [
            //             {
            //                 kind: 'coloredText',
            //                 value: question.title,
            //                 status: 'wrong',
            //             },
            //         ],
            //         answer: undefined,
            //     };
            // }
            const [_, beforeText, afterText] = QTRegexMatch;
            return {
                title: [
                    { kind: 'text', value: beforeText },
                    { kind: 'coloredText', value: question.answer || '....', status: answerStatus },
                    { kind: 'text', value: afterText },
                ],
                answer: undefined,
            };
        case 'texteATrous':
            const tATRegexMatch = question.title.matchAll(TEXTE_A_TROU_REGEX);
            let value = tATRegexMatch.next();
            if (!!value.done) {
                return { title: [{ kind: 'text', value: question.title }], answer: undefined };
            }

            const answers = question.answer
                ? question.answer.split(' ')
                : ' '.repeat(question.rightAnswers.length).split(' ');
            const title: Array<chunkType> = [];
            let lastIndexFound = 0;
            let answerIndex = 0;
            while (!value.done) {
                title.push({
                    kind: 'text',
                    value: question.title.slice(lastIndexFound, value.value.index).trim(),
                });

                title.push({
                    kind: 'coloredText',
                    value: answers[answerIndex] || '....',
                    status:
                        answers[answerIndex] === question.rightAnswers[answerIndex]
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
