import { acceptableAnswerType } from '../../../../types';
import { aggregateAcceptableAnswersByGrade } from './aggregateAcceptableAnswersByGrade';

describe('aggregateAcceptableAnswersByGrade', () => {
    it('should aggregate when no acceptable answers', () => {
        const acceptableAnswers: acceptableAnswerType[][] = [[]];

        const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(acceptableAnswers);

        expect(aggregatedAcceptableAnswers).toEqual({ A: [], B: [], C: [], D: [] });
    });

    it('should aggregate when acceptable answers exist', () => {
        const acceptableAnswers: acceptableAnswerType[][] = [
            [
                { grade: 'A', answer: 'truc' },
                { grade: 'A', answer: 'bidule' },
                { grade: 'C', answer: 'machin' },
            ],
        ];

        const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(acceptableAnswers);

        expect(aggregatedAcceptableAnswers).toEqual({
            A: ['truc', 'bidule'],
            B: [],
            C: ['machin'],
            D: [],
        });
    });
});
