import { buildPackageService } from './package.service';

function buildPackageController() {
    const packageService = buildPackageService();

    return { getPackages, getPackage, getAllPackages };

    function getPackages() {
        return packageService.getPackages();
    }

    function getAllPackages() {
        return packageService.getAllPackages();
    }

    function getPackage(params: { urlParams: { packageId: string } }) {
        return packageService.getPackage(params.urlParams.packageId);
    }
}

export { buildPackageController };
