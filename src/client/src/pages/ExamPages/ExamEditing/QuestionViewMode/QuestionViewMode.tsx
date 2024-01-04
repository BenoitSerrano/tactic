import { ElementType, useState } from 'react';
import {
    pointsViewModeComponentMapping,
    questionEditingComponentMapping,
    questionPreviewingComponentMapping,
    viewModeType,
} from '../constants';
import { styled } from '@mui/material';
import { QuestionContainer } from '../../components/QuestionContainer';
import { questionType } from '../types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { useAlert } from '../../../../lib/alert';
import { EditionActionMenu } from '../EditionActionMenu';
import { formErrorHandler } from '../lib/formErrorHandler';

function QuestionViewMode(props: {
    question: questionType;
    index: number;
    examId: string;
    exerciseId: number;
}): JSX.Element {
    const [currentViewMode, setCurrentViewMode] = useState<viewModeType>('previewing');
    const questionViewModeComponentMapping: Record<viewModeType, ElementType> = {
        previewing: questionPreviewingComponentMapping[props.question.kind],
        editing: questionEditingComponentMapping[props.question.kind],
    };
    const { displayAlert } = useAlert();
    const queryClient = useQueryClient();
    const updateQuestionMutation = useMutation({
        mutationFn: api.updateQuestion,
        onSuccess: () => {
            setCurrentViewMode('previewing');
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
        },
    });
    const [points, setPoints] = useState(`${props.question.points}`);
    const [title, setTitle] = useState(props.question.title);
    const [acceptableAnswers, setAcceptableAnswers] = useState(props.question.acceptableAnswers);
    const [possibleAnswers, setPossibleAnswers] = useState(props.question.possibleAnswers);
    const deleteQuestionMutation = useMutation({
        mutationFn: api.deleteQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
            displayAlert({ variant: 'success', text: 'La question a été supprimée.' });
        },
    });
    const [shouldDisplayErrors, setShouldDisplayErrors] = useState(false);
    const formErrors = formErrorHandler.computeFormErrors(props.question.kind, {
        title: title,
        possibleAnswers,
        acceptableAnswers,
        points: Number(points),
    });
    const PointsViewModeComponent = pointsViewModeComponentMapping[currentViewMode];

    const areThereErrors = formErrors.length > 0;
    const QuestionViewModeComponent = questionViewModeComponentMapping[currentViewMode];
    const isSaving = updateQuestionMutation.isPending;

    return (
        <QuestionContainer>
            <LeftContainer>
                <QuestionIndicatorsContainer>
                    <PointsViewModeComponent
                        points={points}
                        setPoints={setPoints}
                        formErrors={formErrors}
                        shouldDisplayErrors={shouldDisplayErrors}
                    />
                </QuestionIndicatorsContainer>
                <ViewModeToggleContainer>
                    <EditionActionMenu
                        isDeleting={deleteQuestionMutation.isPending}
                        onDelete={deleteQuestion}
                        onCancel={cancelChanges}
                        isSaving={isSaving}
                        onSave={saveQuestion}
                        currentViewMode={currentViewMode}
                        setCurrentViewMode={setCurrentViewMode}
                    />
                </ViewModeToggleContainer>
            </LeftContainer>

            <QuestionViewModeComponent
                formErrors={formErrors}
                title={title}
                setTitle={setTitle}
                possibleAnswers={possibleAnswers}
                setPossibleAnswers={setPossibleAnswers}
                acceptableAnswers={acceptableAnswers}
                setAcceptableAnswers={setAcceptableAnswers}
                index={props.index}
                shouldDisplayErrors={shouldDisplayErrors}
            />
        </QuestionContainer>
    );

    function cancelChanges() {
        setAcceptableAnswers(props.question.acceptableAnswers);
        setPoints(`${props.question.points}`);
        setPossibleAnswers(props.question.possibleAnswers);
        setTitle(props.question.title);
        setCurrentViewMode('previewing');
    }

    function saveQuestion() {
        setShouldDisplayErrors(true);
        if (areThereErrors) {
            return;
        }
        const updatedQuestion = {
            ...props.question,
            possibleAnswers,
            acceptableAnswers,
            title,
            points: Number(points),
        };
        updateQuestionMutation.mutate({
            ...updatedQuestion,
            examId: props.examId,
            exerciseId: props.exerciseId,
            questionId: props.question.id,
        });
    }

    function deleteQuestion() {
        // eslint-disable-next-line no-restricted-globals
        const hasConfirmed = confirm(
            'Souhaitez-vous réellement supprimer cette question ? Tous les résultats des élèves pour cette question seront également supprimés.',
        );
        if (hasConfirmed) {
            deleteQuestionMutation.mutate({ examId: props.examId, questionId: props.question.id });
        }
    }
}

const ViewModeToggleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}));
const LeftContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
});

const QuestionIndicatorsContainer = styled('div')(({ theme }) => ({
    width: 100,
    display: 'flex',
    justifyContent: 'center',
}));

export { QuestionViewMode };
