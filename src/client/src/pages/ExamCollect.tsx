import { styled, Typography } from '@mui/material';
import { pathHandler } from '../lib/pathHandler';
import { useAlert } from '../lib/alert';
import { config } from '../config';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { Link } from '../components/Link';
import { Section } from '../components/Section';
import { examApiType } from './ExamList/types';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Loader } from '../components/Loader';
import { ExamPageTitle } from '../components/ExamPageTitle';

function ExamCollect() {
    const { displayAlert } = useAlert();
    const params = useParams();
    const url = computeUrl(params.examId as string);
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

            <Typography variant="h3">Collecte des réponses</Typography>
            <Section title="Adresse de passage de l'examen">
                <Typography variant="h6">
                    Cliquez sur le bouton ci-dessous pour copier le lien à envoyer à vos
                    étudiant.es.
                </Typography>
                <Button variant="contained" onClick={copyUrlToClipboard}>
                    Copier
                </Button>
                <Typography variant="h6">
                    Vos étudiant.es arriveront sur une page où iels devront rentrer leur email
                    d'identification. Pour gérer vos classes d'étudiant.es, cliquez{' '}
                    <Link to={pathHandler.getRoutePath('ESTABLISHMENT')}>ici</Link>.
                </Typography>
            </Section>
        </Container>
    );

    async function copyUrlToClipboard() {
        try {
            await navigator.clipboard.writeText(url);
            displayAlert({
                text: 'Le lien a bien été copié dans le presse-papiers',
                variant: 'success',
            });
        } catch (error) {
            console.error(error);
            displayAlert({
                autoHideDuration: null,
                variant: 'error',
                text: `Le lien n'a pas pu être copié dans le presse-papiers.`,
            });
        }
    }

    function computeUrl(examId: string) {
        const path = pathHandler.getRoutePath('STUDENT_AUTHENTICATION_EXAM_TAKING_SHORTENED', {
            examId,
        });
        const url = `${config.HOST_URL}${path}`;
        return url;
    }
}

const Container = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
}));

export { ExamCollect };
