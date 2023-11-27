import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MenuItem, Select, SelectChangeEvent, TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { questionKindType, questionKinds } from '../../types';
import { questionUpsertionModalContentComponentMapping } from './constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';
import { FLOATING_NUMBER_REGEX, questionSpecificityMapping } from '../../constants';
import { computeInitialModalQuestionKind } from './lib/computeInitialModalQuestionKind';

function QuestionUpsertionModal(props: {
    close: () => void;
    defaultQuestionKind: questionKindType;
    modalStatus: modalStatusType;
    examId: string;
    exerciseId: number;
    defaultPoints: number;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const initialQuestionKind = computeInitialModalQuestionKind(
        props.modalStatus,
        props.defaultQuestionKind,
    );
    const [currentQuestionKind, setCurrentQuestionKind] =
        useState<questionKindType>(initialQuestionKind);

    const updateQuestionMutation = useMutation({
        mutationFn: api.updateQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'exercises', props.exerciseId],
            });
        },
    });

    const createQuestionMutation = useMutation({
        mutationFn: api.createQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'exercises', props.exerciseId],
            });
        },
    });

    const QuestionUpsertionModalContentComponent =
        questionUpsertionModalContentComponentMapping[currentQuestionKind];

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing'
            ? `${props.modalStatus.question.points}`
            : props.defaultPoints,
    );
    const [title, setTitle] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.title}` : '',
    );
    const [rightAnswers, setRightAnswers] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.rightAnswers : [],
    );
    const [acceptableAnswers, setAcceptableAnswers] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.acceptableAnswers : [],
    );
    const [possibleAnswers, setPossibleAnswers] = useState(
        props.modalStatus.kind === 'editing' && props.modalStatus.question.possibleAnswers
            ? props.modalStatus.question.possibleAnswers
            : ['', ''],
    );

    const isUpdating = updateQuestionMutation.isPending;
    const isCreating = createQuestionMutation.isPending;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);
    const isConfirmDisabled = computeIsConfirmDisabled(currentQuestionKind, {
        title,
        rightAnswers,
        possibleAnswers,
        acceptableAnswers,
    });

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestion}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'une question`}
            isConfirmDisabled={isConfirmDisabled}
        >
            <>
                {props.modalStatus.kind === 'creating' && (
                    <Select
                        fullWidth
                        labelId="select-question-kind-label"
                        id="select-question-kind"
                        value={currentQuestionKind}
                        label="Type de question"
                        onChange={handleQuestionKindChange}
                    >
                        {questionKinds.map((questionKind) => (
                            <MenuItem value={questionKind}>
                                {questionSpecificityMapping[questionKind].label}
                            </MenuItem>
                        ))}
                    </Select>
                )}
                <QuestionUpsertionModalContentComponent
                    title={title}
                    setTitle={setTitle}
                    rightAnswers={rightAnswers}
                    setRightAnswers={setRightAnswers}
                    acceptableAnswers={acceptableAnswers}
                    setAcceptableAnswers={setAcceptableAnswers}
                    possibleAnswers={possibleAnswers}
                    setPossibleAnswers={setPossibleAnswers}
                />
                <RowContainer>
                    <PointsContainer>
                        <TextField
                            value={points}
                            onChange={onChangePoint}
                            label="Point(s) pour la question"
                        />
                    </PointsContainer>
                </RowContainer>
            </>
        </Modal>
    );

    function handleQuestionKindChange(event: SelectChangeEvent) {
        const newDefaultQuestionKind = event.target.value as questionKindType;
        setCurrentQuestionKind(newDefaultQuestionKind);
    }

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setPoints(value);
        }
    }

    function saveQuestion() {
        const newQuestion = {
            points: Number(points),
            title,
            kind: currentQuestionKind,
            possibleAnswers:
                currentQuestionKind === 'qcm'
                    ? possibleAnswers.map((possibleAnswer) => possibleAnswer.trim())
                    : [],
            rightAnswers: rightAnswers.map((rightAnswer) => rightAnswer.trim()),
            acceptableAnswers: acceptableAnswers.map((acceptableAnswer) => acceptableAnswer.trim()),
        };
        if (props.modalStatus?.kind === 'editing') {
            updateQuestionMutation.mutate({
                examId: props.examId,
                exerciseId: props.exerciseId,
                questionId: props.modalStatus.question.id,
                ...newQuestion,
            });
        } else {
            createQuestionMutation.mutate({
                examId: props.examId,
                exerciseId: props.exerciseId,
                ...newQuestion,
            });
        }
    }
}

const RowContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    flex: 1,
    width: '100%',
});

const PointsContainer = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
});

export { QuestionUpsertionModal };
