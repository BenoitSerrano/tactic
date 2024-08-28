import { FormControlLabel, styled, Switch, Typography } from '@mui/material';
import { attemptActionEncoder } from '../lib/attemptActionEncoder';
import { pathHandler } from '../lib/pathHandler';
import { useAlert } from '../lib/alert';
import { config } from '../config';
import { useParams } from 'react-router-dom';
import { Button } from '../components/Button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Section } from '../components/Section';

type shouldDisplayRightAnswersApiType = { shouldDisplayRightAnswers: boolean };

function ExamConsult() {
    const params = useParams();
    const examId = params.examId as string;
    const url = computeUrl(examId);
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const query = useQuery<shouldDisplayRightAnswersApiType>({
        queryKey: ['exams', examId, 'shouldDisplayRightAnswers'],
        queryFn: () => api.fetchShouldDisplayRightAnswersForExamId({ examId }),
    });
    const updateShouldDisplayRightAnswersMutation = useMutation({
        mutationFn: api.updateShouldDisplayRightAnswersForExamId,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exams', examId, 'shouldDisplayRightAnswers'],
            });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Les modifications n'ont pas pu être enregistrées.",
            });
        },
    });

    return (
        <Container>
            <Typography variant="h3">Consultation des copies</Typography>
            <Section title="Adresse de consultation de la copie">
                <Typography variant="h6">
                    Cliquez sur le bouton ci-dessous pour copier le lien à envoyer à vos étudiant.es
                    qu'iels puisse consulter leur copie.
                </Typography>
                <Button variant="contained" onClick={copyUrlToClipboard}>
                    Copier
                </Button>
                <Typography variant="h6">
                    Vos étudiant.es arriveront sur une page où iels devront rentrer leur email
                    d'identification pour consulter leur copie.
                </Typography>
            </Section>

            {!!query.data && (
                <Section title="Affichage des réponses correctes">
                    <FormControlLabel
                        control={
                            <Switch
                                disabled={query.isPending}
                                checked={query.data.shouldDisplayRightAnswers}
                                onChange={onToggleSwitch}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        }
                        label="Afficher les réponses correctes pour chaque question directement sur la copie"
                    />
                </Section>
            )}
        </Container>
    );

    function onToggleSwitch(_: React.ChangeEvent, checked: boolean) {
        updateShouldDisplayRightAnswersMutation.mutate({
            examId,
            shouldDisplayRightAnswers: checked,
        });
    }

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
        const encodedAction = attemptActionEncoder.encode('consult');
        const path = pathHandler.getRoutePath('STUDENT_AUTHENTICATION', {
            examId,
            encodedAction,
        });
        const url = `${config.HOST_URL}${path}`;
        return url;
    }
}

const Container = styled('div')(({ theme }) => ({
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
}));

export { ExamConsult };
