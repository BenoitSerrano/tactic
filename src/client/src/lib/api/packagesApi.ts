import { BASE_URL } from './constants';
import { performApiCall } from './lib/performApiCall';

const packagesApi = {
    getPackages,
    getPackage,
};

type packageApiType = { id: string; paperCount: number; price: number };

async function getPackages(): Promise<packageApiType[]> {
    const URL = `${BASE_URL}/packages`;
    return performApiCall(URL, 'GET');
}

async function getPackage(packageId: string): Promise<packageApiType> {
    const URL = `${BASE_URL}/packages/${packageId}`;
    return performApiCall(URL, 'GET');
}

export { packagesApi };
export type { packageApiType };
