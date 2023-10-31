import { IconButton, Tooltip, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { computeAnswerStatus } from './lib/computeAnswerStatus';
import { questionType } from './types';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../../lib/alert';
import { api } from '../../lib/api';

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

    return (
        <UpdateAnswersButtonContainer>
            <Tooltip title="Marquer la réponse comme correcte">
                <IconButton
                    size="small"
                    color="success"
                    disabled={answerStatus === 'right'}
                    onClick={onAddToRightAnswers}
                >
                    <CheckIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme acceptable">
                <IconButton
                    size="small"
                    color="warning"
                    disabled={
                        answerStatus === 'acceptable' ||
                        (answerStatus === 'right' && props.question.rightAnswers.length <= 1)
                    }
                    onClick={onAddToAcceptableAnswers}
                >
                    <SentimentNeutralIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Tooltip title="Marquer la réponse comme incorrecte">
                <IconButton
                    size="small"
                    color="error"
                    disabled={answerStatus === 'wrong' || props.question.rightAnswers.length <= 1}
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
