import { buildPackageService } from './package.service';

function buildPackageController() {
    const packageService = buildPackageService();

    return { getPackages };

    function getPackages() {
        return packageService.getPackages();
    }
}

export { buildPackageController };
