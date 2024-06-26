import { computeRoundMark } from '../../../lib/computeRoundMark';
import { CONVERSION_DENOMINATOR, convertMark } from '../../../lib/convertMark';
import { examResultsApiType } from '../types';

function createCsv(examResultsApi: examResultsApiType) {
    const csv: string[][] = [];
    const roundedTotalPoints = computeRoundMark(examResultsApi.totalPoints);

    const header = [
        'E-mail',
        `Note (/ ${roundedTotalPoints})`,
        `Note (/ ${CONVERSION_DENOMINATOR})`,
    ];
    csv.push(header);
    const rows: string[][] = [];
    for (const examResult of examResultsApi.results) {
        const row: string[] = [];
        row.push(examResult.email);
        const { roundedConvertedMark, roundedTotalMark } = convertMark({
            totalMark: examResult.mark,
            totalPoints: examResultsApi.totalPoints,
        });

        row.push(`${roundedTotalMark}`);
        row.push(`${roundedConvertedMark}`);
        rows.push(row);
    }
    rows.sort((resultA, resultB) => resultA[0].localeCompare(resultB[0]));
    for (const row of rows) {
        csv.push(row);
    }
    return csv;
}

export { createCsv };
