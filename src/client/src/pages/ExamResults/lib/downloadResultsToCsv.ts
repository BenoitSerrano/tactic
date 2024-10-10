import { examResultsApiType } from '../types';
import { createCsv } from './createCsv';

function downloadResultsToCsv(examResultsApi: examResultsApiType) {
    const csv = createCsv(examResultsApi, [
        'email',
        'lastName',
        'firstName',
        'totalMark',
        'convertedMark',
        'actualDuration',
        'roundTrips',
        'timeSpentOutside',
    ]);
    const data = csv.map((row) => row.map((cell) => `"${cell}"`).join(';')).join('\n');
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Résultats - ${examResultsApi.examName}.csv`;
    a.click();
}

export { downloadResultsToCsv };
