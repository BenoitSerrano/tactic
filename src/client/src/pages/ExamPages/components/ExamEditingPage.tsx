import { styled } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../../lib/api';
import { Loader } from '../../../components/Loader';
import { Breadcrumbs } from '../../../components/Breadcrumbs';

function ExamEditingPage(props: { children: React.ReactNode }) {
    const establishmentsQuery = useQuery({
        queryKey: ['establishments'],
        queryFn: api.fetchEstablishments,
    });
    if (!establishmentsQuery.data) {
        if (establishmentsQuery.isLoading) {
            return <Loader />;
        }
        return <div />;
    }
    return (
        <Container>
            <Breadcrumbs establishments={establishmentsQuery.data} />
            {props.children}
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({}));

export { ExamEditingPage };
