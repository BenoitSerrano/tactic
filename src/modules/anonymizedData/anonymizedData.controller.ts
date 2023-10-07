import { buildAnonymizedDataService } from './anonymizedData.service';

export { buildAnonymizedDataController };

function buildAnonymizedDataController() {
    const anonymizedDataService = buildAnonymizedDataService();
    const anonymizedDataController = {
        getAnonymizedData,
    };

    return anonymizedDataController;

    async function getAnonymizedData() {
        return anonymizedDataService.getAnonymizedData();
    }
}
