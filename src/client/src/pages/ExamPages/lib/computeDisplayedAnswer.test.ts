import { gradeType } from '../../../types';
import { computeDisplayedAnswer } from './computeDisplayedAnswer';

describe('computeDisplayedAnswer', () => {
    describe('questionReponse', () => {
        it('should return the completed title with "" if no answer', () => {
            const question = {
                id: 2,
                title: "Croyez-vous que John soit à l'origine de ces lettres anonymes ?",
                kind: 'questionReponse' as const,
                possibleAnswers: [],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'Non, pas vraiment' }]],
                answer: '',
                grade: 'E' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    {
                        kind: 'text',
                        value: "Croyez-vous que John soit à l'origine de ces lettres anonymes ?",
                    },
                ],
                answer: [{ kind: 'coloredText', value: '', status: 'wrong', grade: 'E' }],
            });
        });
        it('should return the completed title with color', () => {
            const question = {
                id: 2,
                title: "Croyez-vous que John soit à l'origine de ces lettres anonymes ?",
                kind: 'questionReponse' as const,
                possibleAnswers: [],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'Oui !' }]],
                answer: 'Oui !',
                grade: 'A' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'right');

            expect(displayedAnswer).toEqual({
                title: [
                    {
                        kind: 'text',
                        value: "Croyez-vous que John soit à l'origine de ces lettres anonymes ?",
                    },
                ],
                answer: [{ kind: 'coloredText', value: 'Oui !', status: 'right', grade: 'A' }],
            });
        });
    });

    describe('texteATrous', () => {
        it('should return the title if answers empty', () => {
            const question = {
                id: 2,
                title: 'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?',
                kind: 'texteATrous' as const,
                possibleAnswers: [],
                acceptableAnswers: [
                    [{ grade: 'A' as gradeType, answer: 'des' }],
                    [{ grade: 'A' as gradeType, answer: 'une' }],
                    [{ grade: 'A' as gradeType, answer: 'ses' }],
                    [{ grade: 'A' as gradeType, answer: 'sa' }],
                    [{ grade: 'A' as gradeType, answer: 'son' }],
                ],
                answer: '',
                mark: 2,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    { kind: 'text', value: 'Portez-vous' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'personne, vous remarquez en premier :' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'yeux,' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'silhouette,' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'sourire?' },
                ],
                answer: undefined,
            });
        });

        it('should return the title if one answer is acceptable', () => {
            const question = {
                id: 2,
                title: 'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?',
                kind: 'texteATrous' as const,
                possibleAnswers: [],
                acceptableAnswers: [
                    [{ grade: 'A' as gradeType, answer: 'des' }],
                    [{ grade: 'A' as gradeType, answer: 'une' }],
                    [{ grade: 'A' as gradeType, answer: 'ses' }],
                    [
                        { grade: 'A' as gradeType, answer: 'sa' },
                        { grade: 'C' as gradeType, answer: 'sah' },
                    ],
                    [{ grade: 'A' as gradeType, answer: 'son' }],
                ],
                answer: 'des|une|ses|sah|son',
                mark: 2,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    { kind: 'text', value: 'Portez-vous' },
                    { kind: 'coloredText', value: 'des', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
                    { kind: 'coloredText', value: 'une', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'personne, vous remarquez en premier :' },
                    { kind: 'coloredText', value: 'ses', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'yeux,' },
                    { kind: 'coloredText', value: 'sah', status: 'acceptable', grade: 'C' },
                    { kind: 'text', value: 'silhouette,' },
                    { kind: 'coloredText', value: 'son', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'sourire?' },
                ],
                answer: undefined,
            });
        });

        it('should return the title with color for right answers', () => {
            const question = {
                id: 2,
                title: 'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?',
                kind: 'texteATrous' as const,
                possibleAnswers: [],
                acceptableAnswers: [
                    [{ grade: 'A' as gradeType, answer: 'des' }],
                    [{ grade: 'A' as gradeType, answer: 'une' }],
                    [{ grade: 'A' as gradeType, answer: 'ses' }],
                    [{ grade: 'A' as gradeType, answer: 'sa' }],
                    [{ grade: 'A' as gradeType, answer: 'son' }],
                ],
                answer: 'des|une|ses|sa|son',
                mark: 2,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    { kind: 'text', value: 'Portez-vous' },
                    { kind: 'coloredText', value: 'des', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
                    { kind: 'coloredText', value: 'une', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'personne, vous remarquez en premier :' },
                    { kind: 'coloredText', value: 'ses', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'yeux,' },
                    { kind: 'coloredText', value: 'sa', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'silhouette,' },
                    { kind: 'coloredText', value: 'son', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'sourire?' },
                ],
                answer: undefined,
            });
        });

        it('should return the title with different color for answers', () => {
            const question = {
                id: 2,
                title: 'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?',
                kind: 'texteATrous' as const,
                possibleAnswers: [],
                acceptableAnswers: [
                    [{ grade: 'A' as gradeType, answer: 'des' }],
                    [{ grade: 'A' as gradeType, answer: 'une' }],
                    [{ grade: 'A' as gradeType, answer: 'ses' }],
                    [{ grade: 'A' as gradeType, answer: 'sa' }],
                    [{ grade: 'A' as gradeType, answer: 'son' }],
                ],
                answer: 'des|truc|ses|sa|son',
                mark: 2,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    { kind: 'text', value: 'Portez-vous' },
                    { kind: 'coloredText', value: 'des', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
                    { kind: 'coloredText', value: 'truc', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'personne, vous remarquez en premier :' },
                    { kind: 'coloredText', value: 'ses', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'yeux,' },
                    { kind: 'coloredText', value: 'sa', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'silhouette,' },
                    { kind: 'coloredText', value: 'son', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'sourire?' },
                ],
                answer: undefined,
            });
        });

        it('should return the title with several answers not filled', () => {
            const question = {
                id: 2,
                title: 'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?',
                kind: 'texteATrous' as const,
                possibleAnswers: [],
                acceptableAnswers: [
                    [{ grade: 'A' as gradeType, answer: 'des' }],
                    [{ grade: 'A' as gradeType, answer: 'une' }],
                    [{ grade: 'A' as gradeType, answer: 'ses' }],
                    [{ grade: 'A' as gradeType, answer: 'sa' }],
                    [{ grade: 'A' as gradeType, answer: 'son' }],
                ],
                answer: 'des||ses|sa|son',
                mark: 2,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [
                    { kind: 'text', value: 'Portez-vous' },
                    { kind: 'coloredText', value: 'des', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
                    { kind: 'coloredText', value: '....', status: 'wrong', grade: 'E' },
                    { kind: 'text', value: 'personne, vous remarquez en premier :' },
                    { kind: 'coloredText', value: 'ses', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'yeux,' },
                    { kind: 'coloredText', value: 'sa', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'silhouette,' },
                    { kind: 'coloredText', value: 'son', status: 'right', grade: 'A' },
                    { kind: 'text', value: 'sourire?' },
                ],
                answer: undefined,
            });
        });
    });

    describe('texteLibre', () => {
        it('should return the title and empty answer if not answer provided', () => {
            const question = {
                id: 2,
                title: 'Texte libre ?',
                kind: 'texteLibre' as const,
                possibleAnswers: [],
                acceptableAnswers: [],
                answer: undefined,
                grade: undefined as any,
                mark: undefined,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'Texte libre ?' }],
                answer: [{ kind: 'coloredText', value: '', status: 'wrong', grade: 'E' }],
            });
        });

        it('should return the title and colored answer if answer provided', () => {
            const question = {
                id: 2,
                title: 'Texte libre ?',
                kind: 'texteLibre' as const,
                possibleAnswers: [],
                acceptableAnswers: [],
                answer: "Youpi j'ai une assez bonne note",
                grade: 'C' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'acceptable');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'Texte libre ?' }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: "Youpi j'ai une assez bonne note",
                        status: 'acceptable',
                        grade: 'C',
                    },
                ],
            });
        });
    });
    describe('phraseMelangee', () => {
        it('should return the title and colored answer if no answer provided', () => {
            const question = {
                id: 2,
                title: 'est la vie belle',
                kind: 'phraseMelangee' as const,
                possibleAnswers: [],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'la vie est belle' }]],
                answer: '',
                grade: 'E' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'est la vie belle' }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: '',
                        status: 'wrong',
                        grade: 'E',
                    },
                ],
            });
        });
        it('should return the title and colored answer if answer provided', () => {
            const question = {
                id: 2,
                title: 'est la vie belle',
                kind: 'phraseMelangee' as const,
                possibleAnswers: [],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'la vie est belle' }]],
                answer: 'la vie est belle',
                grade: 'A' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'right');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'est la vie belle' }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: 'la vie est belle',
                        status: 'right',
                        grade: 'A',
                    },
                ],
            });
        });
    });
    describe('qcm', () => {
        it('should return the title and colored answer if no answer provided', () => {
            const question = {
                id: 2,
                title: 'la couleur de mes yeux ?',
                kind: 'qcm' as const,
                possibleAnswers: ['rouge', 'bleu', 'vert', 'noir'],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'bleu' }]],
                answer: undefined,
                grade: 'E' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'wrong');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'la couleur de mes yeux ?' }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: '',
                        status: 'wrong',
                        grade: 'E',
                    },
                ],
            });
        });
        it('should return the title and colored answer if answer provided', () => {
            const question = {
                id: 2,
                title: 'la couleur de mes yeux ?',
                kind: 'qcm' as const,
                possibleAnswers: ['rouge', 'bleu', 'vert', 'noir'],
                acceptableAnswers: [[{ grade: 'A' as gradeType, answer: 'bleu' }]],
                answer: '1',
                grade: 'A' as gradeType,
                points: 2,
            };
            const displayedAnswer = computeDisplayedAnswer(question, 'right');

            expect(displayedAnswer).toEqual({
                title: [{ kind: 'text', value: 'la couleur de mes yeux ?' }],
                answer: [
                    {
                        kind: 'coloredText',
                        value: 'bleu',
                        status: 'right',
                        grade: 'A',
                    },
                ],
            });
        });
    });
});
