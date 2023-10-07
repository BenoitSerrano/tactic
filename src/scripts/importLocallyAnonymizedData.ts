import { dataSource } from '../dataSource';
import { api } from '../lib/api';
import { anonymizedDataType, buildAnonymizedDataService } from '../modules/anonymizedData';

async function importLocallyAnonymizedData() {
    await dataSource.initialize();
    const anonymizedDataService = buildAnonymizedDataService();
    console.log('Fetching anonymized data...');
    const anonymizedData: anonymizedDataType = await api.fetchAnonymizedData();
    console.log('Anonymized data fetched! Inserting in database...');
    await anonymizedDataService.insertAnonymizedData(anonymizedData);
    console.log('Anonymized data inserted!');
    return;
}

importLocallyAnonymizedData();
