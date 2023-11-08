import { IconButton, Tooltip, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { computeAnswerStatus } from './lib/computeAnswerStatus';
import { questionType } from './types';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';
import { api } from '../../lib/api';
import { computeCanAnswerBeMarkedAs } from './lib/computeCanAnswerBeMarkedAs';

function UpdateAnswersButtons(props: {
    question: questionType;
    onEditAnswers: () => void;
    examId: string;
}) {
    const { displayAlert } = useAlert();

    const addRightAnswerMutation = useMutation({
        mutationFn: api.addQuestionRightAnswer,
        onSuccess: () => {
            props.onEditAnswers();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const removeOkAnswerMutation = useMutation({
        mutationFn: api.removeOkAnswer,
        onSuccess: () => {
            props.onEditAnswers();
        },
        onError: (error) => {
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
            props.onEditAnswers();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const answerStatus = computeAnswerStatus(props.question.mark, props.question.points);
    const canAnswerBeMarkedAsAcceptable = computeCanAnswerBeMarkedAs(
        'acceptable',
        answerStatus,
        props.question,
    );
    const canAnswerBeMarkedAsRight = computeCanAnswerBeMarkedAs(
        'right',
        answerStatus,
        props.question,
    );
    const canAnswerBeMarkedAsWrong = computeCanAnswerBeMarkedAs(
        'wrong',
        answerStatus,
        props.question,
    );
    return (
        <UpdateAnswersButtonContainer>
            <Tooltip title="Marquer la réponse comme correcte">
                <IconButton
                    size="small"
                    color="success"
                    disabled={!canAnswerBeMarkedAsRight}
                    onClick={onAddToRightAnswers}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme acceptable">
                <IconButton
                    size="small"
                    color="warning"
                    disabled={!canAnswerBeMarkedAsAcceptable}
                    onClick={onAddToAcceptableAnswers}
                >
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme incorrecte">
                <IconButton
                    size="small"
                    color="error"
                    disabled={!canAnswerBeMarkedAsWrong}
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
        addRightAnswerMutation.mutate({
            examId: props.examId,
            questionId: props.question.id,
            rightAnswer: props.question.answer,
        });
    }

    function onRemoveOkAnswer() {
        if (props.question.answer === undefined) {
            return;
        }
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
        addAcceptableAnswerMutation.mutate({
            examId: props.examId,
            questionId: props.question.id,
            acceptableAnswer: props.question.answer,
        });
    }
}

const UpdateAnswersButtonContainer = styled('div')(({ theme }) => ({}));

export { UpdateAnswersButtons };
