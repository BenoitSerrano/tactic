import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { useAlert } from '../../lib/alert';

type questionChoixMultipleType = {
    id: number;
    title: string;
    rightAnswerIndex: number;
    possibleAnswers: string[];
    points: number;
};

type questionChoixMultipleModalStatusType = modalStatusType<questionChoixMultipleType>;

function QuestionChoixMultipleUpsertionModal(props: {
    close: () => void;
    modalStatus: questionChoixMultipleModalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const updateQuestionChoixMultipleMutation = useMutation({
        mutationFn: api.updateQuestionChoixMultiple,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createQuestionChoixMultipleMutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const [title, setTitle] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.title : '',
    );
    const [rightAnswerIndex, setRightAnswerIndex] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.rightAnswerIndex : 0,
    );
    const [possibleAnswers, setPossibleAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.question.possibleAnswers
            : ['', '', '', ''],
    );

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.points}` : '1.0',
    );

    const isUpdating = updateQuestionChoixMultipleMutation.isLoading;
    const isCreating = createQuestionChoixMultipleMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestionChoixMultiple}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'une QCM`}
        >
            <ModalContent>
                <InputContainer>
                    <TextField
                        value={title}
                        label="Intitulé"
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </InputContainer>
                <RadioGroup
                    value={rightAnswerIndex}
                    onChange={(event) => setRightAnswerIndex(Number(event.target.value))}
                >
                    {possibleAnswers.map((possibleAnswer: string, possibleAnswerIndex: number) => {
                        return (
                            <InputContainer key={possibleAnswerIndex}>
                                <FormControlLabel
                                    value={possibleAnswerIndex}
                                    control={<Radio />}
                                    label={
                                        <TextField
                                            label={`Réponse n°${possibleAnswerIndex + 1}`}
                                            fullWidth
                                            value={possibleAnswer}
                                            onChange={buildOnChangePossibleAnswer(
                                                possibleAnswerIndex,
                                            )}
                                        />
                                    }
                                />
                            </InputContainer>
                        );
                    })}
                </RadioGroup>{' '}
                <RowContainer>
                    <PointsContainer>
                        <TextField
                            value={points}
                            onChange={onChangePoint}
                            label="Point(s) pour la question"
                        />
                    </PointsContainer>
                </RowContainer>
            </ModalContent>
        </Modal>
    );

    function buildOnChangePossibleAnswer(possibleAnswerIndex: number) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.indexOf(',') !== -1) {
                return;
            }
            setPossibleAnswers([
                ...possibleAnswers.slice(0, possibleAnswerIndex),
                event.target.value,
                ...possibleAnswers.slice(possibleAnswerIndex + 1),
            ]);
        };
    }

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(/^[0-9]+(\.)?([0-9]+)?$/)) {
            setPoints(value);
        }
    }

    function saveQuestionChoixMultiple() {
        if (props.modalStatus?.kind === 'editing') {
            updateQuestionChoixMultipleMutation.mutate({
                examId: props.examId,
                qcmId: props.modalStatus.question.id,
                possibleAnswers,
                rightAnswerIndex,
                title,
                points: Number(points),
            });
        } else {
            createQuestionChoixMultipleMutation.mutate({
                examId: props.examId,
                possibleAnswers,
                rightAnswerIndex,
                title,
                points: Number(points),
            });
        }
    }
}

const ModalContent = styled('div')({ width: '100%' });
const InputContainer = styled('div')({ marginTop: 4, marginBottom: 4 });

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

export { QuestionChoixMultipleUpsertionModal };

export type { questionChoixMultipleType, questionChoixMultipleModalStatusType };
