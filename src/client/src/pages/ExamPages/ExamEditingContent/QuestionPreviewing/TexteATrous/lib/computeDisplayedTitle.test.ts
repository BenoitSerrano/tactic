import { gradeType } from '../../../../../../types';
import { computeDisplayedTitle } from './computeDisplayedTitle';

describe('computeDisplayedTitle', () => {
    it('should return the title with color for right answers', () => {
        const title = 'la .... est .... belle de toutes.';
        const acceptableAnswers = [
            [{ grade: 'A' as gradeType, answer: 'vie' }],
            [{ grade: 'A' as gradeType, answer: 'la plus' }],
        ];

        const displayedTitle = computeDisplayedTitle(title, acceptableAnswers);

        expect(displayedTitle).toEqual([
            { kind: 'text', word: 'la' },
            { kind: 'rightAnswerText', words: ['vie'] },
            { kind: 'text', word: 'est' },
            { kind: 'rightAnswerText', words: ['la', 'plus'] },
            { kind: 'text', word: 'belle' },
            { kind: 'text', word: 'de' },
            { kind: 'text', word: 'toutes.' },
        ]);
    });
});
