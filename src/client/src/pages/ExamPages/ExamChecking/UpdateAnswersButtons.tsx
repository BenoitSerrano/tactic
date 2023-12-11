import { IconButton, Tooltip, styled } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';
import { questionWithAnswersType } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';
import { api } from '../../../lib/api';
import { computeCanAnswerBeAttributed } from './lib/computeCanAnswerBeAttributed';
import { useGlobalLoading } from '../../../lib/globalLoading';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import { ElementType } from 'react';

type attributeMarkToAnswerActionType = {
    name: string;
    multiplier: number;
    IconComponent: ElementType;
    color: 'success' | 'error' | 'warning';
};
const attributeMarkToAnswerActions: attributeMarkToAnswerActionType[] = [
    {
        name: 'fausse',
        multiplier: 0,
        IconComponent: ClearIcon,
        color: 'error',
    },
    {
        name: 'passable',
        multiplier: 0.25,
        IconComponent: SentimentVeryDissatisfiedIcon,
        color: 'warning',
    },
    {
        name: 'moyenne',
        multiplier: 0.5,
        IconComponent: SentimentNeutralIcon,
        color: 'warning',
    },
    {
        name: 'acceptable',
        multiplier: 0.75,
        IconComponent: SentimentSatisfiedAltIcon,
        color: 'warning',
    },
    {
        name: 'correcte',
        multiplier: 1,
        IconComponent: CheckIcon,
        color: 'success',
    },
];

function UpdateAnswersButtons(props: {
    canCorrectAttempt: boolean;
    question: questionWithAnswersType;
    refetch: () => void;
    examId: string;
    attemptId: string;
    isQuestionManuallyCorrected: boolean;
}) {
    const { displayAlert } = useAlert();
    const { updateGlobalLoading } = useGlobalLoading();

    const removeOkAnswerMutation = useMutation({
        mutationFn: api.removeOkAnswer,
        onSuccess: () => {
            updateGlobalLoading('attribute-mark-to-answer', false);

            props.refetch();
        },
        onError: (error) => {
            updateGlobalLoading('attribute-mark-to-answer', false);

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
            updateGlobalLoading('attribute-mark-to-answer', false);

            props.refetch();
        },
        onError: (error) => {
            updateGlobalLoading('attribute-mark-to-answer', false);

            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const saveMarkMutation = useMutation({
        mutationFn: api.updateMark,
        onSuccess: () => {
            updateGlobalLoading('save-mark', false);
            props.refetch();
        },
        onError: (error) => {
            updateGlobalLoading('save-mark', false);
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre dernière note n'a pas pu être sauvegardée.",
            });
        },
    });

    return (
        <UpdateAnswersButtonContainer>
            {attributeMarkToAnswerActions.map((attributeMarkToAnswerAction) => {
                const { color, IconComponent, multiplier, name } = attributeMarkToAnswerAction;
                const canAnswerBeAttributedMark = computeCanAnswerBeAttributed(
                    multiplier * props.question.points,
                    props.question,
                );
                return (
                    <Tooltip key={name} title={`Marquer comme ${name}`}>
                        <IconButton
                            size="small"
                            color={color}
                            disabled={!canAnswerBeAttributedMark}
                            onClick={buildOnAttributeMarkToAnswer(multiplier)}
                        >
                            <IconComponent fontSize="small" />
                        </IconButton>
                    </Tooltip>
                );
            })}
        </UpdateAnswersButtonContainer>
    );

    function buildOnAttributeMarkToAnswer(multiplier: number) {
        return () => {
            if (props.question.answer === undefined) {
                return;
            }
            updateGlobalLoading('attribute-mark-to-answer', true);

            if (props.isQuestionManuallyCorrected) {
                updateGlobalLoading('save-mark', true);
                saveMarkMutation.mutate({
                    examId: props.examId,
                    attemptId: props.attemptId,
                    questionId: props.question.id,
                    mark: multiplier * props.question.points,
                });
            } else {
                if (multiplier === 0) {
                    removeOkAnswerMutation.mutate({
                        examId: props.examId,
                        questionId: props.question.id,
                        okAnswer: props.question.answer,
                    });
                } else {
                    addAcceptableAnswerMutation.mutate({
                        examId: props.examId,
                        questionId: props.question.id,
                        acceptableAnswerWithPoints: {
                            answer: props.question.answer,
                            points: multiplier * props.question.points,
                        },
                    });
                }
            }
        };
    }
}

const UpdateAnswersButtonContainer = styled('div')(({ theme }) => ({}));

export { UpdateAnswersButtons };
