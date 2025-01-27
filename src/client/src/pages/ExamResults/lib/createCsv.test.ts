import { createCsv } from './createCsv';

describe('createCsv', () => {
    it('should return CSV with right format', () => {
        const results = [
            {
                id: 'truc',
                email: 'benoit.s@truc.fr',
                firstName: 'Benoit',
                lastName: 'S.',
                attemptId: 'truc',
                startedAt: '2023-07-24 07:00:00.000 +0200',
                isTimeLimitExceeded: true,
                attemptStatus: 'corrected' as const,
                actualDuration: 3206,
                mark: 30.625,
                roundTrips: 0,
                timeSpentOutside: 0,
                isTreated: true,
            },
            {
                id: 'machin',
                email: 'bartholome.g@truc.fr',
                firstName: 'Bartholomé',
                lastName: 'G.',
                attemptId: 'machin',
                startedAt: '2023-07-25 07:00:00.000 +0200',
                isTimeLimitExceeded: true,
                attemptStatus: 'corrected' as const,
                actualDuration: 3425,
                mark: 52.5,
                roundTrips: 0,
                timeSpentOutside: 0,
                isTreated: true,
            },
        ];
        const examResults = {
            results,
            totalPoints: 65,
            examName: 'ESAJ - LEVEL 3 - FINAL EXAM',
            examDuration: 60,
        };
        const columns = [
            'email' as const,
            'lastName' as const,
            'firstName' as const,
            'totalMark' as const,
            'convertedMark' as const,
        ];

        const csv = createCsv(examResults, columns, { sortBy: 'email' });

        expect(csv).toEqual([
            ['E-mail', 'Nom de famille', 'Prénom', 'Note (/ 65)', 'Note (/ 20)'],
            ['bartholome.g@truc.fr', 'G.', 'Bartholomé', '52.5', '16.25'],
            ['benoit.s@truc.fr', 'S.', 'Benoit', '30.75', '9.5'],
        ]);
    });
});
