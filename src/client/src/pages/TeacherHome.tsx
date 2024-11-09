import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';
import { Navigate } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';

type establishmentApiType = { id: string; name: string };

function TeacherHome() {
    const query = useQuery<establishmentApiType[]>({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });
    if (!query.data) {
        return <Loader />;
    }
    if (query.data.length === 0) {
        return <div>Vous n'avez pas d'établissement</div>;
    }
    const currentEstablishmentId = query.data[0].id;
    return (
        <Navigate
            to={pathHandler.getRoutePath('EXAM_LIST', { establishmentId: currentEstablishmentId })}
        />
    );
}

export { TeacherHome };
