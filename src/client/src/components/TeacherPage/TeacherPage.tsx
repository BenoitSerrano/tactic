import { styled } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { HEADER_HEIGHT } from '../../constants';
import { TeacherHeader } from './TeacherHeader';
import { localSessionHandler } from '../../lib/localSessionHandler';
import { Breadcrumbs } from '../Breadcrumbs';
import { Loader } from '../Loader';
import { useQuery } from '@tanstack/react-query';
import { establishmentsApi } from '../../lib/api/establishmentsApi';

function TeacherPage(props: { children: React.ReactNode | null }) {
    const userRoles = localSessionHandler.getUserRoles();
    const establishmentsQuery = useQuery({
        queryKey: ['establishments', 'with-classes'],
        queryFn: establishmentsApi.getEstablishmentsWithClasses,
    });
    if (!userRoles || !userRoles.includes('teacher')) {
        return <Navigate to="/sign-in" />;
    }
    if (!establishmentsQuery.data) {
        if (establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <Container>
            <TeacherHeader />
            <ContentContainer>
                <Breadcrumbs establishments={establishmentsQuery.data} />
                <ChildrenContainer>{props.children}</ChildrenContainer>
            </ContentContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled('div')({
    paddingTop: HEADER_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
});
const ChildrenContainer = styled('div')({ flex: 1, display: 'flex', flexDirection: 'column' });

export { TeacherPage };
