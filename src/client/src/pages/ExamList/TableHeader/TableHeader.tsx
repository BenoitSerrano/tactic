import { ClasseTableHeader } from './ClasseTableHeader';
import { EstablishmentTableHeader } from './EstablishmentTableHeader';
import { OverallTableHeader } from './OverallTableHeader';

function TableHeader(props: { classeId: string | undefined; establishmentId: string | undefined }) {
    if (!props.establishmentId) {
        return <OverallTableHeader />;
    } else if (!props.classeId) {
        return <EstablishmentTableHeader />;
    } else {
        return <ClasseTableHeader />;
    }
}

export { TableHeader };
