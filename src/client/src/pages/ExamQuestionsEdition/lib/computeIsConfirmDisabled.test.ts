import { acceptableAnswerWithPointsType } from '../../../types';
import { computeIsConfirmDisabled } from './computeIsConfirmDisabled';

describe('computeIsConfirmDisabled', () => {
    const points = 6;
    test('qcm with no rightAnswer = true', () => {
        const questionKind = 'qcm';
        const title = 'title';
        const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('qcm with one answer = true', () => {
        const questionKind = 'qcm';
        const title = 'title';
        const possibleAnswers: string[] = ['a'];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: '0' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    test('qcm rightly filled = false', () => {
        const questionKind = 'qcm';
        const title = 'title';
        const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: '0' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('questionTrou with no right answer = true', () => {
        const questionKind = 'questionTrou';
        const title = 'ceci est .... phrase';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('questionTrou with no .... = true', () => {
        const questionKind = 'questionTrou';
        const title = 'title';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: 'rightAnswer' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('questionTrou rightly filled = false', () => {
        const questionKind = 'questionTrou';
        const title = 'title .... and end';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: 'rightAnswer' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('phraseMelangee with no right answer = true', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci est une phrase';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('phraseMelangee not shuffled = true', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci est une phrase';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: 'ceci est une phrase' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('phraseMelangee rightly filled = false', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci une phrase est';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: 'ceci est une phrase' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('No title = true', () => {
        const questionKind = 'qcm';
        const title = '';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('texteLibre with a title = false', () => {
        const questionKind = 'texteLibre';
        const title = 'title';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(false);
    });

    test('texteATrous with no .... = true', () => {
        const questionKind = 'texteATrous';
        const title = 'tu es la plus belle';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points, answer: 'la' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    test('texteATrous with a  difference between .... count and right answers length = true', () => {
        const questionKind = 'texteATrous';
        const title = 'tu es .... plus belle';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points: points / 2, answer: 'la' },
            { points: points / 2, answer: 'plus' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(true);
    });

    test('texteATrous with right count of acceptableAnswersWithPoints and .... = false', () => {
        const questionKind = 'texteATrous';
        const title = 'tu .... la .... belle';
        const possibleAnswers: string[] = [];
        const acceptableAnswersWithPoints: acceptableAnswerWithPointsType[] = [
            { points: points / 2, answer: 'la' },
            { points: points / 2, answer: 'plus' },
        ];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            acceptableAnswersWithPoints,
        });

        expect(isConfirmDisabled).toBe(false);
    });
});
