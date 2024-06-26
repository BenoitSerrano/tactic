import { computeRoundMark } from '../../../lib/computeRoundMark';
import { CONVERSION_DENOMINATOR, convertMark } from '../../../lib/convertMark';
import { formatNumber } from '../../../lib/formatNumber';
import { time } from '../../../lib/time';
import { examResultsApiType } from '../types';

const COLUMNS = [
    'email',
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
        convertedMark: `Note (/ ${CONVERSION_DENOMINATOR})`,
        totalMark: `Note (/ ${roundedTotalPoints})`,
        actualDuration: 'Durée',
        roundTrips: "Sorties de la page d'examen",
        timeSpentOutside: "Temps cumulé passé hors de la page d'examen",
    };

    const header = columns.map((column) => HEADERS[column]);
    csv.push(header);
    const rows: string[][] = [];
    for (const examResult of examResultsApi.results) {
        const row: string[] = [];
        for (const column of columns) {
            switch (column) {
                case 'email':
                    row.push(examResult.email);
                    break;
                case 'convertedMark':
                    const { roundedConvertedMark } = convertMark({
                        totalMark: examResult.mark,
                        totalPoints: examResultsApi.totalPoints,
                    });

                    row.push(formatNumber(Number(roundedConvertedMark)));
                    break;
                case 'totalMark':
                    const { roundedTotalMark } = convertMark({
                        totalMark: examResult.mark,
                        totalPoints: examResultsApi.totalPoints,
                    });
                    row.push(formatNumber(Number(roundedTotalMark)));
                    break;
                case 'actualDuration':
                    if (examResult.actualDuration === undefined) {
                        row.push('-');
                    } else {
                        const readableActualDuration = time.formatToClock(
                            examResult.actualDuration,
                        );
                        row.push(readableActualDuration);
                    }
                    break;
                case 'roundTrips':
                    row.push(`${examResult.roundTrips}`);
                    break;
                case 'timeSpentOutside':
                    const timeSpentOutside = time.formatToClock(
                        Math.floor(examResult.timeSpentOutside / 1000),
                        {
                            hideHours: true,
                        },
                    );
                    row.push(timeSpentOutside);
            }
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

export { createCsv };
