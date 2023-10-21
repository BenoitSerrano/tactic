import { computeIsConfirmDisabled } from './computeIsConfirmDisabled';

describe('computeIsConfirmDisabled', () => {
    test('qcm with no rightAnswer = true', () => {
        const questionKind = 'qcm';
        const title = 'title';
        const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
        const rightAnswers: string[] = [];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('qcm rightly filled = false', () => {
        const questionKind = 'qcm';
        const title = 'title';
        const possibleAnswers: string[] = ['a', 'b', 'c', 'd'];
        const rightAnswers: string[] = ['0'];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('questionTrou with no right answer = true', () => {
        const questionKind = 'questionTrou';
        const title = 'ceci est .... phrase';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = [];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('questionTrou with no .... = true', () => {
        const questionKind = 'questionTrou';
        const title = 'title';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = ['rightAnswer'];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('questionTrou rightly filled = false', () => {
        const questionKind = 'questionTrou';
        const title = 'title .... and end';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = ['rightAnswer'];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('phraseMelangee with no right answer = true', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci est une phrase';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = [];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('phraseMelangee not shuffled = true', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci est une phrase';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = ['ceci est une phrase'];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('phraseMelangee rightly filled = false', () => {
        const questionKind = 'phraseMelangee';
        const title = 'ceci une phrase est';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = ['ceci est une phrase'];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(false);
    });
    test('No title = true', () => {
        const questionKind = 'qcm';
        const title = '';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = [];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(true);
    });
    test('texteLibre with a title = false', () => {
        const questionKind = 'texteLibre';
        const title = 'title';
        const possibleAnswers: string[] = [];
        const rightAnswers: string[] = [];
        const acceptableAnswers: string[] = [];

        const isConfirmDisabled = computeIsConfirmDisabled(questionKind, {
            title,
            possibleAnswers,
            rightAnswers,
            acceptableAnswers,
        });

        expect(isConfirmDisabled).toBe(false);
    });
});
