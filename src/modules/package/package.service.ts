import { config } from '../../config';
import { dataSource } from '../../dataSource';
import { Package } from './Package.entity';

function buildPackageService() {
    const packageRepository = dataSource.getRepository(Package);
    return {
        getPackages,
        getAllPackages,
        getPackage,
    };

    async function getPackages() {
        const packages = await packageRepository.find({
            order: { paperCount: 'ASC' },
            select: { id: true, paperCount: true, price: true },
        });
        return { packages, freePapersCount: config.FREE_PAPERS_COUNT };
    }

    async function getAllPackages() {
        return packageRepository.find({});
    }

    function getPackage(packageId: Package['id']) {
        const pack = packageRepository.findOneOrFail({
            where: { id: packageId },
        });
        return pack;
    }
}

export { buildPackageService };
