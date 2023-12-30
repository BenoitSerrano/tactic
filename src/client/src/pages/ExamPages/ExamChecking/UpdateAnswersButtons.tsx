import { styled } from '@mui/material';
import { amendableQuestionWithAnswersType } from '../types';
import { useMutation } from '@tanstack/react-query';
import { useAlert } from '../../../lib/alert';
import { api } from '../../../lib/api';
import { computeCanAnswerBeAttributed } from './lib/computeCanAnswerBeAttributed';
import { computeIsUpdateAnswerButtonLoading } from './lib/computeIsUpdateAnswerButtonLoading';
import { attemptStatusType, gradeType } from '../../../types';
import { attributeGradeToAnswerActions } from './constants';
import { IconButton } from '../../../components/IconButton';

function UpdateAnswersButtons(props: {
    attemptStatus: attemptStatusType;
    question: amendableQuestionWithAnswersType;
    refetch: () => void;
    examId: string;
    attemptId: string;
    isQuestionManuallyCorrected: boolean;
}) {
    const { displayAlert } = useAlert();

    const removeOkAnswerMutation = useMutation({
        mutationFn: api.removeOkAnswer,
        onSuccess: () => {
            props.refetch();
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
            props.refetch();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre modification n'a pas pu être prise en compte",
            });
        },
    });

    const saveGradeMutation = useMutation({
        mutationFn: api.updateGrade,
        onSuccess: () => {
            props.refetch();
        },
        onError: (error) => {
            console.error(error);
            displayAlert({
                variant: 'error',
                text: "Une erreur est survenue. Votre dernière note n'a pas pu être sauvegardée.",
            });
        },
    });

    return (
        <UpdateAnswersButtonContainer>
            {attributeGradeToAnswerActions.map((attributeMarkToAnswerAction) => {
                const { color, IconComponent, grade, name } = attributeMarkToAnswerAction;
                const canAnswerBeAttributedMark = computeCanAnswerBeAttributed(
                    grade,
                    props.question,
                );

                const addAcceptableAnswerLoadingInfo =
                    addAcceptableAnswerMutation.isPending &&
                    addAcceptableAnswerMutation.variables.acceptableAnswer
                        ? addAcceptableAnswerMutation.variables.acceptableAnswer.grade
                        : undefined;

                const updateGradeLoadingInfo = saveGradeMutation.isPending
                    ? saveGradeMutation.variables.grade
                    : undefined;

                const isLoading = computeIsUpdateAnswerButtonLoading(
                    grade,
                    props.isQuestionManuallyCorrected,
                    {
                        removeOkAnswer: removeOkAnswerMutation.isPending,
                        addAcceptableAnswer: addAcceptableAnswerLoadingInfo,
                        updateGrade: updateGradeLoadingInfo,
                    },
                );

                return (
                    <IconButton
                        title={`Marquer comme ${name}`}
                        size="small"
                        color={color}
                        disabled={!canAnswerBeAttributedMark || isLoading}
                        onClick={buildOnAttributeMarkToAnswer(grade)}
                        isLoading={isLoading}
                        IconComponent={IconComponent}
                    />
                );
            })}
        </UpdateAnswersButtonContainer>
    );

    function buildOnAttributeMarkToAnswer(grade: gradeType) {
        return () => {
            if (props.question.answer === undefined) {
                return;
            }
            if (props.attemptStatus === 'corrected') {
                displayAlert({
                    variant: 'error',
                    text: 'Cette copie est marquée comme corrigée, vous ne pouvez plus modifier la note.',
                });
                return;
            }

            if (props.isQuestionManuallyCorrected) {
                saveGradeMutation.mutate({
                    examId: props.examId,
                    attemptId: props.attemptId,
                    questionId: props.question.id,
                    grade,
                });
            } else {
                if (grade === 'E') {
                    removeOkAnswerMutation.mutate({
                        examId: props.examId,
                        questionId: props.question.id,
                        okAnswer: props.question.answer,
                    });
                } else {
                    addAcceptableAnswerMutation.mutate({
                        examId: props.examId,
                        questionId: props.question.id,
                        acceptableAnswer: {
                            answer: props.question.answer,
                            grade,
                        },
                    });
                }
            }
        };
    }
}

const UpdateAnswersButtonContainer = styled('div')(({ theme }) => ({
    display: 'flex',
}));

export { UpdateAnswersButtons };
