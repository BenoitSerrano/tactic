import { Question } from '../Question.entity';
import { questionDtoType } from '../types';
import { questionEncoder } from './questionEncoder';

describe('questionEncoder', () => {
    describe('decode', () => {
        it('should decode a regular question', () => {
            const question: Omit<Question, 'exercise'> = {
                id: 1,
                kind: 'questionReponse',
                points: 2,
                title: 'title',
                order: 1,
                possibleAnswers: [],
                acceptableAnswers: ['A:c3VyZQ==', 'A:Y2VydGFpbmU=', 'B:Ym9m'],
            };

            const decodedQuestion = questionEncoder.decodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual([
                [
                    { grade: 'A', answer: 'sure' },
                    { grade: 'A', answer: 'certaine' },
                    { grade: 'B', answer: 'bof' },
                ],
            ]);
        });

        it('should decode a texte à trous question', () => {
            const question: Omit<Question, 'exercise'> = {
                id: 1,
                kind: 'texteATrous',
                points: 2,
                title: 'title',
                order: 1,
                possibleAnswers: [],
                acceptableAnswers: ['A:bGE=|A:bGU=', 'A:ZXN0|B:ZXQ='],
            };

            const decodedQuestion = questionEncoder.decodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual([
                [
                    { grade: 'A', answer: 'la' },
                    { grade: 'A', answer: 'le' },
                ],
                [
                    { grade: 'A', answer: 'est' },
                    { grade: 'B', answer: 'et' },
                ],
            ]);
        });
    });

    describe('encode', () => {
        it('should encode a regular question', () => {
            const question: questionDtoType = {
                id: 1,
                kind: 'qcm',
                points: 2,
                title: 'title',
                order: 1,
                possibleAnswers: ['A', 'B', 'C', 'D'],
                acceptableAnswers: [
                    [
                        { grade: 'A', answer: 'sure' },
                        { grade: 'A', answer: 'certaine' },
                        { grade: 'B', answer: 'bof' },
                    ],
                ],
            };

            const decodedQuestion = questionEncoder.encodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual([
                'A:c3VyZQ==',
                'A:Y2VydGFpbmU=',
                'B:Ym9m',
            ]);
        });

        it('should encode a texteatrous question', () => {
            const question: questionDtoType = {
                id: 1,
                kind: 'texteATrous',
                points: 2,
                title: 'title',
                order: 1,
                possibleAnswers: [],
                acceptableAnswers: [
                    [
                        { grade: 'A', answer: 'la' },
                        { grade: 'A', answer: 'le' },
                    ],
                    [
                        { grade: 'A', answer: 'est' },
                        { grade: 'B', answer: 'et' },
                    ],
                ],
            };

            const decodedQuestion = questionEncoder.encodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual(['A:bGE=|A:bGU=', 'A:ZXN0|B:ZXQ=']);
        });
    });
});
