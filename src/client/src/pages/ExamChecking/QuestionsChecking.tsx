import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { FLOATING_NUMBER_REGEX } from '../../constants';
import { QuestionChecking } from './QuestionChecking';
import { TestPageLayout } from '../../components/TestPageLayout';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { questionType } from './types';

type marksType = Record<number, string>;

function QuestionsChecking(props: {
    questions: Array<questionType>;
    examName: string;
    studentEmail: string;
    attemptId: string;
}) {
    const initialMarks = props.questions.reduce(
        (acc, question) => ({
            ...acc,
            [question.id]: question.mark === undefined ? '' : `${question.mark}`,
        }),
        {} as marksType,
    );
    const [marks, setMarks] = useState<marksType>(initialMarks);
    const { displayAlert } = useAlert();

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

    return (
        <TestPageLayout
            studentEmail={props.studentEmail}
            title={props.examName}
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
            {props.questions.map((question: any, index: number) => (
                <QuestionCheckingContainer key={question.id}>
                    <QuestionIndicatorsContainer>
                        {question.rightAnswers.length === 0 ? (
                            <MarkTextField
                                onChange={buildOnMarkChange(question.id)}
                                value={marks[question.id] || ''}
                                variant="standard"
                            />
                        ) : (
                            <Typography>{question.mark || 0}</Typography>
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
    );

    function saveMarks() {
        const formattedMarks = Object.entries(marks).reduce(
            (acc, [questionId, mark]) => ({ ...acc, [questionId]: Number(mark) }),
            {} as Record<number, number>,
        );
        saveMarksMutation.mutate({ attemptId: props.attemptId, marks: formattedMarks });
    }

    function buildOnMarkChange(questionId: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const mark = event.target.value;
            if (mark.match(FLOATING_NUMBER_REGEX)) {
                setMarks({ ...marks, [questionId]: mark });
            }
        };
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

export { QuestionsChecking };
