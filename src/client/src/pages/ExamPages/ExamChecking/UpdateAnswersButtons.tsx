import { IconButton, Tooltip, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { questionWithAnswersType } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';
import { api } from '../../../lib/api';
import { computeCanAnswerBeAttributed } from './lib/computeCanAnswerBeAttributed';
import { useGlobalLoading } from '../../../lib/globalLoading';

function UpdateAnswersButtons(props: {
    canCorrectAttempt: boolean;
    question: questionWithAnswersType;
    refetch: () => void;
    examId: string;
}) {
    const { displayAlert } = useAlert();
    const { updateGlobalLoading } = useGlobalLoading();

    const removeOkAnswerMutation = useMutation({
        mutationFn: api.removeOkAnswer,
        onSuccess: () => {
            updateGlobalLoading('remove-ok-answer', false);

            props.refetch();
        },
        onError: (error) => {
            updateGlobalLoading('remove-ok-answer', false);

            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const addAcceptableAnswerMutation = useMutation({
        mutationFn: api.addQuestionAcceptableAnswer,
        onSuccess: () => {
            updateGlobalLoading('add-acceptable-answer', false);

            props.refetch();
        },
        onError: (error) => {
            updateGlobalLoading('add-acceptable-answer', false);

            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeAttributed(
        props.question.points / 2,
        props.question.mark || 0,
        props.question,
    );
    const canAnswerBeMarkedAsRight = computeCanAnswerBeAttributed(
        props.question.points,
        props.question.mark || 0,
        props.question,
    );
    const canAnswerBeMarkedAsWrong = computeCanAnswerBeAttributed(
        0,
        props.question.mark || 0,
        props.question,
    );
    return (
        <UpdateAnswersButtonContainer>
            <Tooltip title="Marquer la réponse comme correcte">
                <IconButton
                    size="small"
                    color="success"
                    disabled={!canAnswerBeMarkedAsRight || !props.canCorrectAttempt}
                    onClick={onAddToRightAnswers}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme acceptable">
                <IconButton
                    size="small"
                    color="warning"
                    disabled={!canAnswerBeMarkedAsAcceptable || !props.canCorrectAttempt}
                    onClick={onAddToAcceptableAnswers}
                >
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme incorrecte">
                <IconButton
                    size="small"
                    color="error"
                    disabled={!canAnswerBeMarkedAsWrong || !props.canCorrectAttempt}
                    onClick={onRemoveOkAnswer}
                >
                    <ClearIcon fontSize="small" />
                </IconButton>
            </Tooltip>
        </UpdateAnswersButtonContainer>
    );

    function onAddToRightAnswers() {
        if (props.question.answer === undefined) {
            return;
        }

        updateGlobalLoading('add-acceptable-answer', true);

        addAcceptableAnswerMutation.mutate({
            examId: props.examId,
            questionId: props.question.id,
            acceptableAnswer: props.question.answer,
            points: props.question.points,
        });
    }

    function onRemoveOkAnswer() {
        if (props.question.answer === undefined) {
            return;
        }
        updateGlobalLoading('remove-ok-answer', true);

        removeOkAnswerMutation.mutate({
            examId: props.examId,
            questionId: props.question.id,
            okAnswer: props.question.answer,
        });
    }

    function onAddToAcceptableAnswers() {
        if (props.question.answer === undefined) {
            return;
        }
        updateGlobalLoading('add-acceptable-answer', true);

        addAcceptableAnswerMutation.mutate({
            examId: props.examId,
            questionId: props.question.id,
            acceptableAnswer: props.question.answer,
            points: props.question.points / 2,
        });
    }
}

const UpdateAnswersButtonContainer = styled('div')(({ theme }) => ({}));

export { UpdateAnswersButtons };
