import { gradeType } from '../../../../types';
import { computeDisplayedMark } from './computeDisplayedMark';

describe('computeDisplayedMark', () => {
    const baseQuestion = { id: 1, points: 1, title: 'titre ....' };
    it('should return the grade for automatic questions even if answer not filled', () => {
        const answer = undefined;
        const grade = 'E' as gradeType;
        const mark = undefined;
        const acceptableAnswers = [[{ grade: 'A' as const, answer: 'vraie réponse' }]];
        const question = {
            ...baseQuestion,
            kind: 'questionReponse' as const,
            answer,
            grade,
            mark,
            acceptableAnswers,
        };

        const displayedMark = computeDisplayedMark(question);

        expect(displayedMark).toEqual({ mark: '0', points: 1 });
    });

    it('should return the grade for automatic questions if answer filled', () => {
        const answer = 'vraie réponse';
        const grade = 'A' as gradeType;
        const mark = undefined;
        const acceptableAnswers = [[{ grade: 'A' as const, answer: 'vraie réponse' }]];
        const question = {
            ...baseQuestion,
            kind: 'questionReponse' as const,
            answer,
            grade,
            mark,
            acceptableAnswers,
        };

        const displayedMark = computeDisplayedMark(question);

        expect(displayedMark).toEqual({ mark: '1', points: 1 });
    });

    it('should display a default 0 for manual questions if answer not filled', () => {
        const answer = undefined;
        const grade = 'E' as const;
        const mark = undefined;
        const acceptableAnswers = [[{ grade: 'A' as const, answer: 'vraie réponse' }]];
        const question = {
            ...baseQuestion,
            kind: 'questionReponse' as const,
            answer,
            grade,
            mark,
            acceptableAnswers,
        };

        const displayedMark = computeDisplayedMark(question);

        expect(displayedMark).toEqual({ mark: '0', points: 1 });
    });

    it('should display ... for manual questions if answer filled but grade not yet attributed', () => {
        const answer = 'truc';
        const mark = undefined;
        const question = {
            ...baseQuestion,
            kind: 'texteLibre' as const,
            answer,
            mark,
        };

        const displayedMark = computeDisplayedMark(question);

        expect(displayedMark).toEqual({ mark: '', points: 1 });
    });
});
