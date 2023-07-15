import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { FormControlLabel, Radio, RadioGroup, TextField, Typography, styled } from '@mui/material';
import { modalStatusType } from './types';

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

    const updateQuestionChoixMultipleMutation = useMutation({
        mutationFn: api.updateQuestionChoixMultiple,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createQuestionChoixMultipleMutation = useMutation({
        mutationFn: api.createQuestionChoixMultiple,
        onSuccess: () => {
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

    const isUpdating = updateQuestionChoixMultipleMutation.isLoading;
    const isCreating = createQuestionChoixMultipleMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestionChoixMultiple}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
        >
            <ModalContent>
                <Typography variant="h2">Création d'une QCM</Typography>
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
                </RadioGroup>
            </ModalContent>
        </Modal>
    );

    function computeConfirmButtonLabel(modalStatus: questionChoixMultipleModalStatusType) {
        switch (modalStatus.kind) {
            case 'creating':
                return 'Créer';
            case 'editing':
                return 'Modifier';
        }
    }

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

    function saveQuestionChoixMultiple() {
        if (props.modalStatus?.kind === 'editing') {
            updateQuestionChoixMultipleMutation.mutate({
                examId: props.examId,
                qcmId: props.modalStatus.question.id,
                possibleAnswers,
                rightAnswerIndex,
                title,
            });
        } else {
            createQuestionChoixMultipleMutation.mutate({
                examId: props.examId,
                possibleAnswers,
                rightAnswerIndex,
                title,
            });
        }
    }
}

const ModalContent = styled('div')({ width: '100%' });
const InputContainer = styled('div')({ marginTop: 4, marginBottom: 4 });

export { QuestionChoixMultipleUpsertionModal };

export type { questionChoixMultipleType, questionChoixMultipleModalStatusType };
