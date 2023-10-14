import { dataSource } from '../../dataSource';
import { PhraseMelangee } from './PhraseMelangee.entity';
import { mapEntities } from '../../lib/mapEntities';

export { buildPhraseMelangeeService };

function buildPhraseMelangeeService() {
    const phraseMelangeeRepository = dataSource.getRepository(PhraseMelangee);
    const phraseMelangeeService = {
        getAllPhrasesMelangees,
        bulkInsertPhrasesMelangees,
    };

    return phraseMelangeeService;

    async function getAllPhrasesMelangees() {
        const phrasesMelangees = await phraseMelangeeRepository.find({
            relations: ['exam'],
            select: { exam: { id: true } },
        });
        return mapEntities(phrasesMelangees);
    }

    async function bulkInsertPhrasesMelangees(phrasesMelangees: Array<PhraseMelangee>) {
        return phraseMelangeeRepository.insert(phrasesMelangees);
    }
}
