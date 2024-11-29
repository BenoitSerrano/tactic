import { examResultApiType, examResultsApiType } from '../../../lib/api/examsApi';
import { computeRoundMark } from '../../../lib/computeRoundMark';
import { CONVERSION_DENOMINATOR, convertMark } from '../../../lib/convertMark';
import { formatNumber } from '../../../lib/formatNumber';
import { time } from '../../../lib/time';

const COLUMNS = [
    'email',
    'lastName',
    'firstName',
    'totalMark',
    'convertedMark',
    'actualDuration',
    'roundTrips',
    'timeSpentOutside',
] as const;
type columnType = (typeof COLUMNS)[number];

function createCsv(
    examResultsApi: examResultsApiType,
    columns: columnType[],
    options?: { sortBy?: columnType },
) {
    const csv: string[][] = [];
    const roundedTotalPoints = computeRoundMark(examResultsApi.totalPoints);
    const HEADERS: Record<columnType, string> = {
        email: 'E-mail',
        lastName: 'Nom de famille',
        firstName: 'Prénom',
        convertedMark: `Note (/ ${CONVERSION_DENOMINATOR})`,
        totalMark: `Note (/ ${roundedTotalPoints})`,
        actualDuration: 'Durée',
        roundTrips: "Sorties de la page d'examen",
        timeSpentOutside: "Temps cumulé passé hors de la page d'examen",
    };

    const header = columns.map((column) => HEADERS[column]);
    csv.push(header);
    const rows: string[][] = [];
    const treatedResults = examResultsApi.results.filter((result) => result.isTreated);
    for (const examResult of treatedResults) {
        const row: string[] = [];
        for (const column of columns) {
            const value = getValueForColumn(examResult, examResultsApi.totalPoints, column);
            row.push(value);
        }

        rows.push(row);
    }
    if (options?.sortBy) {
        const sortBy = options.sortBy;
        const indexOfSortBy = columns.indexOf(sortBy);
        if (indexOfSortBy !== -1) {
            rows.sort((resultA, resultB) =>
                resultA[indexOfSortBy].localeCompare(resultB[indexOfSortBy]),
            );
        }
    }
    for (const row of rows) {
        csv.push(row);
    }
    return csv;
}

function getValueForColumn(
    examResult: examResultApiType,
    totalPoints: number,
    column: columnType,
): string {
    switch (column) {
        case 'email':
            return examResult.email;
        case 'convertedMark':
            const { roundedConvertedMark } = convertMark({
                totalMark: examResult.mark,
                totalPoints: totalPoints,
            });

            return formatNumber(Number(roundedConvertedMark));
        case 'totalMark':
            const { roundedTotalMark } = convertMark({
                totalMark: examResult.mark,
                totalPoints: totalPoints,
            });
            return formatNumber(Number(roundedTotalMark));
        case 'actualDuration':
            if (examResult.actualDuration === undefined) {
                return '-';
            } else {
                const readableActualDuration = time.formatToClock(examResult.actualDuration);
                return readableActualDuration;
            }
        case 'roundTrips':
            return `${examResult.roundTrips}`;
        case 'timeSpentOutside':
            const timeSpentOutside = time.formatToClock(
                Math.floor(examResult.timeSpentOutside / 1000),
                {
                    hideHours: true,
                },
            );
            return timeSpentOutside;
        case 'lastName':
            return examResult.lastName;
        case 'firstName':
            return examResult.firstName;
    }
}

export type { columnType };
export { createCsv, COLUMNS };
