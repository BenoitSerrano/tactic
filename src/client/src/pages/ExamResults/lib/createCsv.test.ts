import { createCsv } from './createCsv';

describe('createCsv', () => {
    it('should return CSV with right format', () => {
        const results = [
            {
                id: 'truc',
                email: 'benoit.s@truc.fr',
                attemptId: 'truc',
                startedAt: '2023-07-24 07:00:00.000 +0200',
                isTimeLimitExceeded: true,
                attemptStatus: 'corrected' as const,
                actualDuration: 3206,
                mark: 30.625,
                roundTrips: 0,
                timeSpentOutside: 0,
            },
            {
                id: 'machin',
                email: 'bartholome.g@truc.fr',
                attemptId: 'machin',
                startedAt: '2023-07-25 07:00:00.000 +0200',
                isTimeLimitExceeded: true,
                attemptStatus: 'corrected' as const,
                actualDuration: 3425,
                mark: 52.5,
                roundTrips: 0,
                timeSpentOutside: 0,
            },
        ];
        const examResults = {
            results,
            totalPoints: 65,
            examName: 'ESAJ - LEVEL 3 - FINAL EXAM',
            examDuration: 60,
        };
        const columns = ['email' as const, 'totalMark' as const, 'convertedMark' as const];

        const csv = createCsv(examResults, columns, { sortBy: 'email' });

        expect(csv).toEqual([
            ['E-mail', 'Note (/ 65)', 'Note (/ 20)'],
            ['bartholome.g@truc.fr', '52.5', '16.25'],
            ['benoit.s@truc.fr', '30.75', '9.5'],
        ]);
    });
});
