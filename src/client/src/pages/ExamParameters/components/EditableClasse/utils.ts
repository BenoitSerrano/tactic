import { UUID_REGEX } from '../../../../constants';

function stringifyClasse(establishmentId: string, classeId: string) {
    return `${establishmentId}:${classeId}`;
}

function parseClasse(classe: string) {
    const [establishmentId, classeId] = classe.split(':');
    if (!establishmentId.match(UUID_REGEX) || !classeId.match(UUID_REGEX)) {
        return undefined;
    }
    return { establishmentId, classeId };
}

export { stringifyClasse, parseClasse };
