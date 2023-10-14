import React, { ElementType, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { QCMUpsertionModalContent } from './QCMUpsertionModalContent';
import { QuestionTrouUpsertionModalContent } from './QuestionTrouUpsertionModalContent';
import { PhraseMelangeeUpsertionModalContent } from './PhraseMelangeeUpsertionModalContent';
import { questionKindType } from '../../types';

const questionSpecicityMapping: Record<
    questionKindType,
    { defaultPoints: string; QuestionUpsertionModalContentComponent: ElementType }
> = {
    qcm: {
        defaultPoints: '1.0',
        QuestionUpsertionModalContentComponent: QCMUpsertionModalContent,
    },
    questionTrou: {
        defaultPoints: '2.0',
        QuestionUpsertionModalContentComponent: QuestionTrouUpsertionModalContent,
    },
    phraseMelangee: {
        defaultPoints: '3.0',
        QuestionUpsertionModalContentComponent: PhraseMelangeeUpsertionModalContent,
    },
};

// TODO: ajouter toutes les validations ET indications (hint) côté front

function QuestionUpsertionModal(props: {
    close: () => void;
    modalStatus: modalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const questionKind =
        props.modalStatus.kind === 'creating'
            ? props.modalStatus.questionKind
            : props.modalStatus.question.kind;

    const updateQuestionMutation = useMutation({
        mutationFn: api.updateQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createQuestionMutation = useMutation({
        mutationFn: api.createQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const { defaultPoints, QuestionUpsertionModalContentComponent } =
        questionSpecicityMapping[questionKind];

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing'
            ? `${props.modalStatus.question.points}`
            : defaultPoints,
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
            : ['', '', '', ''],
    );

    const isUpdating = updateQuestionMutation.isLoading;
    const isCreating = createQuestionMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestion}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'une question`}
        >
            <>
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

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(/^[0-9]+(\.)?([0-9]+)?$/)) {
            setPoints(value);
        }
    }

    function saveQuestion() {
        const newQuestion = {
            points: Number(points),
            title,
            kind: questionKind,
            possibleAnswers:
                questionKind === 'qcm'
                    ? possibleAnswers.map((possibleAnswer) => possibleAnswer.trim())
                    : undefined,
            rightAnswers: rightAnswers.map((rightAnswer) => rightAnswer.trim()),
            acceptableAnswers: acceptableAnswers.map((acceptableAnswer) => acceptableAnswer.trim()),
        };
        if (props.modalStatus?.kind === 'editing') {
            updateQuestionMutation.mutate({
                examId: props.examId,
                questionId: props.modalStatus.question.id,
                ...newQuestion,
            });
        } else {
            createQuestionMutation.mutate({
                examId: props.examId,
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
