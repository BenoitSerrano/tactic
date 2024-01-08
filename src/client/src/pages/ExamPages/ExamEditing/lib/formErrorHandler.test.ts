import { acceptableAnswerType } from '../../../../types';
import { formErrorHandler } from './formErrorHandler';

describe('formErrorHandler', () => {
    describe('formErrorHandler.computeFormErrors', () => {
        test('question with points null', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = 0;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['POINTS_SHOULD_BE_POSITIVE']);
        });

        test('question with points NaN', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = NaN;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['POINTS_SHOULD_BE_POSITIVE']);
        });

        test('qcm with no rightAnswer = true', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
            const acceptableAnswers: acceptableAnswerType[][] = [];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['NO_RIGHT_ANSWER']);
        });
        test('qcm with one answer = true', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['a'];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['ONLY_ONE_POSSIBLE_ANSWER']);
        });

        test('qcm with one empty possible answers = true', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['0', '', '2', ''];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['EMPTY_POSSIBLE_ANSWER_1', 'EMPTY_POSSIBLE_ANSWER_3']);
        });

        test('qcm rightly filled = false', () => {
            const questionKind = 'qcm';
            const title = 'title';
            const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual([]);
        });
        test('questionReponse with no right answer = true', () => {
            const questionKind = 'questionReponse';
            const title = 'ceci est une question';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['NO_RIGHT_ANSWER']);
        });

        test('questionReponse with acceptable answers empty = true', () => {
            const questionKind = 'questionReponse';
            const title = 'ceci est une question';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [
                    { grade: 'A', answer: 'truc' },
                    { grade: 'B', answer: '' },
                    { grade: 'C', answer: 'truc' },
                    { grade: 'D', answer: '' },
                ],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['ACCEPTABLE_ANSWER_EMPTY_1', 'ACCEPTABLE_ANSWER_EMPTY_3']);
        });

        test('questionReponse rightly filled = false', () => {
            const questionKind = 'questionReponse';
            const title = 'ceci est une question';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [{ grade: 'A', answer: 'rightAnswer' }],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual([]);
        });
        test('phraseMelangee with no right answer = true', () => {
            const questionKind = 'phraseMelangee';
            const title = 'ceci est une phrase';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['NO_RIGHT_ANSWER']);
        });
        test('phraseMelangee not shuffled = true', () => {
            const questionKind = 'phraseMelangee';
            const title = 'ceci est une phrase';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [
                    { grade: 'A', answer: 'ceci une phrase est' },
                    { grade: 'A', answer: 'ceci est une phrase' },
                ],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['SHUFFLED_PHRASE_SHOULD_NOT_BE_ACCEPTABLE_1']);
        });
        test('phraseMelangee rightly filled = false', () => {
            const questionKind = 'phraseMelangee';
            const title = 'ceci une phrase est';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [{ grade: 'A', answer: 'ceci est une phrase' }],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual([]);
        });
        test('No title = true', () => {
            const questionKind = 'qcm';
            const title = '';
            const possibleAnswers: string[] = ['answer1', 'answrer2'];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: '0' }]];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['NO_TITLE']);
        });
        test('texteLibre with a title = false', () => {
            const questionKind = 'texteLibre';
            const title = 'title';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual([]);
        });

        test('texteATrous with no .... = true', () => {
            const questionKind = 'texteATrous';
            const title = 'tu es la plus belle';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [[{ grade: 'A', answer: 'la' }]];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['NO_BLANKS']);
        });

        test('texteATrous with a  difference between .... count and right answers length = true', () => {
            const questionKind = 'texteATrous';
            const title = 'tu es .... plus belle';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [{ grade: 'C', answer: 'la' }],
                [{ grade: 'C', answer: 'plus' }],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual(['BLANK_RIGHT_ANSWERS_MISMATCH']);
        });

        test('texteATrous with right count of acceptableAnswers and .... = false', () => {
            const questionKind = 'texteATrous';
            const title = 'tu .... la .... belle';
            const possibleAnswers: string[] = [];
            const acceptableAnswers: acceptableAnswerType[][] = [
                [{ grade: 'C', answer: 'la' }],
                [{ grade: 'C', answer: 'plus' }],
            ];
            const points = 2;

            const formError = formErrorHandler.computeFormErrors(questionKind, {
                title,
                possibleAnswers,
                acceptableAnswers,
                points,
            });

            expect(formError).toEqual([]);
        });
    });
});
