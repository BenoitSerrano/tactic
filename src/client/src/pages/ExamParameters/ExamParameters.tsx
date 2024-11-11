import { styled, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { Loader } from '../../components/Loader';
import { EditEdgeText } from './components/EditEdgeText';
import { examApiType } from '../Classe/types';
import { Section } from '../../components/Section';
import { ExamPageTitle } from '../../components/ExamPageTitle';
import { EditableExamDuration } from '../../components/EditableExamDuration';

function ExamParameters() {
    const params = useParams();
    const examQuery = useQuery<examApiType>({
        queryKey: [`exams`, params.examId],
        queryFn: () => api.fetchExam(params.examId as string),
    });
    if (!examQuery.data) {
        if (examQuery.isLoading) {
            return <Loader />;
        } else {
            return <div />;
        }
    }
    const examName = examQuery.data.name;
    return (
        <Container>
            <ExamPageTitle examName={examName} />

            <Typography variant="h3">Paramètres</Typography>
            <Section title="Durée de l'examen">
                <EditableExamDuration exam={examQuery.data} />
            </Section>
            <Section title="Éditer le texte d'accueil de l'examen">
                <EditEdgeText exam={examQuery.data} kind="start" />
            </Section>
            <Section title="Éditer le texte de clôture de l'examen">
                <EditEdgeText exam={examQuery.data} kind="end" />
            </Section>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
}));

export { ExamParameters };
