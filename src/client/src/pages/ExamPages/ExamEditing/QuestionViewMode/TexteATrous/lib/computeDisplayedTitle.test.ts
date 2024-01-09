import { gradeType } from '../../../../../../types';
import { computeDisplayedTitle } from './computeDisplayedTitle';

describe('computeDisplayedTitle', () => {
    it('should return the title with color for right answers', () => {
        const title =
            'Portez-vous .... vêtements décontractés pour aller au travail ? Chez .... personne, vous remarquez en premier : .... yeux, .... silhouette, .... sourire?';
        const acceptableAnswers = [
            [{ grade: 'A' as gradeType, answer: 'des' }],
            [{ grade: 'A' as gradeType, answer: 'une' }],
            [{ grade: 'A' as gradeType, answer: 'ses' }],
            [{ grade: 'A' as gradeType, answer: 'sa' }],
            [{ grade: 'A' as gradeType, answer: 'son' }],
        ];

        const displayedTitle = computeDisplayedTitle(title, acceptableAnswers);

        expect(displayedTitle).toEqual([
            { kind: 'text', value: 'Portez-vous' },
            { kind: 'rightAnswerText', value: 'des' },
            { kind: 'text', value: 'vêtements décontractés pour aller au travail ? Chez' },
            { kind: 'rightAnswerText', value: 'une' },
            { kind: 'text', value: 'personne, vous remarquez en premier :' },
            { kind: 'rightAnswerText', value: 'ses' },
            { kind: 'text', value: 'yeux,' },
            { kind: 'rightAnswerText', value: 'sa' },
            { kind: 'text', value: 'silhouette,' },
            { kind: 'rightAnswerText', value: 'son' },
            { kind: 'text', value: 'sourire?' },
        ]);
    });
});
