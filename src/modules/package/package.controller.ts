import { buildPackageService } from './package.service';

function buildPackageController() {
    const packageService = buildPackageService();

    return { getPackages, getPackage };

    function getPackages() {
        return packageService.getPackages();
    }

    function getPackage(params: { urlParams: { packageId: string } }) {
        return packageService.getPackage(params.urlParams.packageId);
    }
}

export { buildPackageController };
