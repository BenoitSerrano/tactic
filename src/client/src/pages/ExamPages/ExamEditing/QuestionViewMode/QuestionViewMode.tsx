import { ElementType, useState } from 'react';
import {
    pointsViewModeComponentMapping,
    questionEditingComponentMapping,
    questionPreviewingComponentMapping,
    viewModeType,
} from '../constants';
import { Typography, styled } from '@mui/material';
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
    const formErrors = formErrorHandler.computeFormErrors(props.question.kind, {
        title: title,
        possibleAnswers,
        acceptableAnswers,
        points: Number(points),
    });
    const PointsViewModeComponent = pointsViewModeComponentMapping[currentViewMode];

    const isSaveButtonDisabled = formErrors.length > 0;
    const QuestionViewModeComponent = questionViewModeComponentMapping[currentViewMode];
    const isSaving = updateQuestionMutation.isPending;

    return (
        <QuestionContainer key={`question-${props.question.id}`}>
            <ViewModeToggleContainer>
                <EditionActionMenu
                    isSaving={isSaving}
                    isSaveButtonDisabled={isSaveButtonDisabled}
                    onSave={saveQuestion}
                    currentViewMode={currentViewMode}
                    setCurrentViewMode={setCurrentViewMode}
                />
            </ViewModeToggleContainer>
            <QuestionIndicatorsContainer>
                <PointsViewModeComponent
                    points={points}
                    setPoints={setPoints}
                    formErrors={formErrors}
                />
            </QuestionIndicatorsContainer>

            <QuestionViewModeComponent
                formErrors={formErrors}
                title={title}
                setTitle={setTitle}
                possibleAnswers={possibleAnswers}
                setPossibleAnswers={setPossibleAnswers}
                acceptableAnswers={acceptableAnswers}
                setAcceptableAnswers={setAcceptableAnswers}
                index={props.index}
            />
        </QuestionContainer>
    );

    function saveQuestion() {
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
}

const ViewModeToggleContainer = styled('div')(({ theme }) => ({
    position: 'absolute',
    left: -150,
}));

const QuestionIndicatorsContainer = styled('div')({
    minWidth: 100,
    display: 'flex',
});

export { QuestionViewMode };
