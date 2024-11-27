import { Navigate, useSearchParams } from 'react-router-dom';
import { pathHandler } from '../lib/pathHandler';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '../components/Loader';
import { establishmentsApi } from '../lib/api/establishmentsApi';

function TeacherHome() {
    const [searchParams] = useSearchParams();
    const queryParamsPackageId = searchParams.get('packageId');

    const establishmentsQuery = useQuery({
        queryKey: ['establishments', 'with-classes'],
        queryFn: establishmentsApi.getEstablishmentsWithClasses,
    });

    if (queryParamsPackageId) {
        return (
            <Navigate
                to={pathHandler.getRoutePath('PAYMENT_START', { packageId: queryParamsPackageId })}
            />
        );
    }

    if (!establishmentsQuery.data) {
        if (establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    if (establishmentsQuery.data.length === 0) {
        return <Navigate to={pathHandler.getRoutePath('ONBOARDING')} />;
    }
    return (
        <Navigate
            to={pathHandler.getRoutePath('ESTABLISHMENT', {
                establishmentId: establishmentsQuery.data[0].id,
            })}
        />
    );
}

export { TeacherHome };
