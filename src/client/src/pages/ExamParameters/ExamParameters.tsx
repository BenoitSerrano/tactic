import { styled, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { EditEdgeText } from './components/EditEdgeText';
import { examApiType } from '../Classe/types';
import { Section } from '../../components/Section';
import { ExamPageTitle } from '../../components/ExamPageTitle';
import { EditableExamDuration } from '../../components/EditableExamDuration';
import { SelectExamExtremumsSection } from './components/SelectExamExtremumsSection';
import { examsApi } from '../../lib/api/examsApi';

function ExamParameters() {
    const params = useParams();
    const examId = params.examId as string;
    const classeId = params.classeId as string;
    const establishmentId = params.establishmentId as string;

    const examQuery = useQuery<examApiType>({
        queryKey: [`exams`, examId],
        queryFn: () => examsApi.getExam(examId as string),
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
            <Row>
                <Section title="Durée de l'examen">
                    <EditableExamDuration
                        exam={examQuery.data}
                        classeId={classeId}
                        establishmentId={establishmentId}
                    />
                </Section>
                <SelectExamExtremumsSection exam={examQuery.data} />
            </Row>
            <Row>
                <Section title="Éditer le texte d'accueil de l'examen">
                    <EditEdgeText exam={examQuery.data} kind="start" />
                </Section>
            </Row>
            <Row>
                <Section title="Éditer le texte de clôture de l'examen">
                    <EditEdgeText exam={examQuery.data} kind="end" />
                </Section>
            </Row>
        </Container>
    );
}

const Row = styled('div')(({ theme }) => ({ display: 'flex' }));

const Container = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
}));

export { ExamParameters };
