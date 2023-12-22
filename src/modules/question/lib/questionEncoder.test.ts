import { Question } from '../Question.entity';
import { questionDtoType } from '../types';
import { questionEncoder } from './questionEncoder';

describe('questionEncoder', () => {
    describe('decode', () => {
        it('should decode a regular question', () => {
            const question: Omit<Question, 'exercise'> = {
                id: 1,
                kind: 'qcm',
                points: 2,
                title: 'title',
                order: 1,
                possibleAnswers: ['A', 'B', 'C', 'D'],
                acceptableAnswers: ['2:c3VyZQ==', '2:Y2VydGFpbmU=', '1.5:Ym9m'],
            };

            const decodedQuestion = questionEncoder.decodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual([
                { points: 2, answer: 'sure' },
                { points: 2, answer: 'certaine' },
                { points: 1.5, answer: 'bof' },
            ]);
        });

        // it('should decode a texte à trous question', () => {
        //     const question: Omit<Question, 'exercise'> = {
        //         id: 1,
        //         kind: 'texteATrous',
        //         points: 2,
        //         title: 'title',
        //         order: 1,
        //         possibleAnswers: [],
        //         acceptableAnswers: ['2:bGE=|2:bGU=', '2:ZXN0|1.5:ZXQ='],
        //     };

        //     const decodedQuestion = questionEncoder.decodeQuestion(question);

        //     expect(decodedQuestion.acceptableAnswers).toEqual([
        //         [
        //             { points: 2, answer: 'la' },
        //             { points: 2, answer: 'le' },
        //         ],
        //         [
        //             { points: 2, answer: 'est' },
        //             { points: 1.5, answer: 'et' },
        //         ],
        //     ]);
        // });
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
                    { points: 2, answer: 'sure' },
                    { points: 2, answer: 'certaine' },
                    { points: 1.5, answer: 'bof' },
                ],
            };

            const decodedQuestion = questionEncoder.encodeQuestion(question);

            expect(decodedQuestion.acceptableAnswers).toEqual([
                '2:c3VyZQ==',
                '2:Y2VydGFpbmU=',
                '1.5:Ym9m',
            ]);
        });

        // it('should encode a texteatrous question', () => {
        //     const question: questionDtoType = {
        //         id: 1,
        //         kind: 'texteATrous',
        //         points: 2,
        //         title: 'title',
        //         order: 1,
        //         possibleAnswers: [],
        //         acceptableAnswers: [
        //             [
        //                 { points: 2, answer: 'la' },
        //                 { points: 2, answer: 'le' },
        //             ],
        //             [
        //                 { points: 2, answer: 'est' },
        //                 { points: 1.5, answer: 'et' },
        //             ],
        //         ],
        //     };

        //     const decodedQuestion = questionEncoder.encodeQuestion(question);

        //     expect(decodedQuestion.acceptableAnswers).toEqual(['2:bGE=|2:bGU=', '2:ZXN0|1.5:ZXQ=']);
        // });
    });
});
