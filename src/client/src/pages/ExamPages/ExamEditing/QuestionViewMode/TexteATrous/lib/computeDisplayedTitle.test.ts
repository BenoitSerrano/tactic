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
            { kind: 'text', value: 'la' },
            { kind: 'rightAnswerText', words: ['vie'] },
            { kind: 'text', value: 'est' },
            { kind: 'rightAnswerText', words: ['la', 'plus'] },
            { kind: 'text', value: 'belle' },
            { kind: 'text', value: 'de' },
            { kind: 'text', value: 'toutes.' },
        ]);
    });
});
