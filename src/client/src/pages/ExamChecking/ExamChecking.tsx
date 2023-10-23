import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { TextField, Typography, styled } from '@mui/material';
import { Loader } from '../../components/Loader';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../../components/TestPageLayout';
import { LoadingButton } from '@mui/lab';
import { useAlert } from '../../lib/alert';
import { ChangeEvent, useState } from 'react';
import { FLOATING_NUMBER_REGEX } from '../../constants';

function ExamChecking() {
    const params = useParams();
    const { displayAlert } = useAlert();
    //TODO: initialiser le tableau avec les notes récupérées du back-end
    const [marks, setMarks] = useState<Record<number, string>>({});
    const attemptId = params.attemptId as string;
    const query = useQuery(['attempts', attemptId], () => api.fetchAttemptWithAnswers(attemptId));
    const saveMarksMutation = useMutation({
        mutationFn: api.updateMarks,
        onSuccess: () => {
            displayAlert({ variant: 'success', text: 'Vos notes ont bien été sauvegardées' });
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Vos notes n'ont pas pu être sauvegardées.",
            });
        },
    });
    if (!query.data) {
        if (query.isLoading) {
            return <Loader />;
        }
        return <div />;
    }

    return (
        <MainContainer>
            <TestPageLayout
                title={query.data.exam.name}
                buttons={[
                    <LoadingButton
                        loading={saveMarksMutation.isLoading}
                        variant="contained"
                        onClick={saveMarks}
                    >
                        Sauvegarder
                    </LoadingButton>,
                ]}
            >
                {query.data.exam.questions.map((question: any, index: number) => (
                    <QuestionCheckingContainer key={question.id}>
                        <QuestionIndicatorsContainer>
                            {question.rightAnswers.length === 0 ? (
                                <MarkTextField
                                    onChange={buildOnMarkChange(question.id)}
                                    value={marks[question.id] || ''}
                                    variant="standard"
                                />
                            ) : (
                                <Typography>{question.mark}</Typography>
                            )}

                            <Typography> / {question.points}</Typography>
                        </QuestionIndicatorsContainer>
                        <QuestionChecking
                            key={'question' + question.id}
                            index={index + 1}
                            question={question}
                        />
                    </QuestionCheckingContainer>
                ))}
            </TestPageLayout>
        </MainContainer>
    );

    function buildOnMarkChange(questionId: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const mark = event.target.value;
            if (mark.match(FLOATING_NUMBER_REGEX)) {
                setMarks({ ...marks, [questionId]: mark });
            }
        };
    }

    function saveMarks() {
        const formattedMarks = Object.entries(marks).reduce(
            (acc, [questionId, mark]) => ({ ...acc, [questionId]: Number(mark) }),
            {} as Record<number, number>,
        );
        saveMarksMutation.mutate({ attemptId, marks: formattedMarks });
    }
}

const QuestionCheckingContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(1),
    display: 'flex',
}));

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
});

const MarkTextField = styled(TextField)({
    width: 30,
});

const MainContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
});

export { ExamChecking };
