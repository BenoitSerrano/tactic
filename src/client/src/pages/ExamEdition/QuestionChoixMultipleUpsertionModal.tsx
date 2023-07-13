import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { Button, TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { combinator } from '../../lib/combinator';

type questionChoixMultipleType = {
    id: number;
    title: string;
    rightAnswerIndex: number;
    possibleAnswers: string[];
};

type questionChoixMultipleModalStatusType =
    | { kind: 'editing'; questionChoixMultiple: questionChoixMultipleType }
    | { kind: 'creating' };

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
        props.modalStatus.kind === 'editing' ? props.modalStatus.questionChoixMultiple.title : '',
    );
    const [rightAnswerIndex, setRightAnswerIndex] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.questionChoixMultiple.rightAnswerIndex
            : 0,
    );
    const [possibleAnswers, setPossibleAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.questionChoixMultiple.possibleAnswers
            : [],
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
            <>
                <input
                    value={title}
                    placeholder="Intitulé de la question"
                    onChange={(event) => setTitle(event.target.value)}
                />
                {possibleAnswers.map((possibleAnswer: string, possibleAnswerIndex: number) => {
                    const isRightAnswer = possibleAnswerIndex === rightAnswerIndex;
                    return (
                        <React.Fragment key={possibleAnswerIndex}>
                            <input
                                type="radio"
                                id={possibleAnswer}
                                name={`${props.examId}`}
                                value={possibleAnswer}
                                checked={isRightAnswer}
                                onChange={() => setRightAnswerIndex(possibleAnswerIndex)}
                            />
                            <input
                                value={possibleAnswer}
                                onChange={buildOnChangePossibleAnswer(possibleAnswerIndex)}
                            />
                        </React.Fragment>
                    );
                })}
            </>
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
                qcmId: props.modalStatus.questionChoixMultiple.id,
                possibleAnswers,
                rightAnswerIndex,
                title,
            });
        } else {
            // createQuestionChoixMultipleMutation.mutate({
            //     examId: props.examId,
            //     correctPhrases,
            //     shuffledPhrase,
            //     words,
            // });
        }
    }
}

export { QuestionChoixMultipleUpsertionModal };

export type { questionChoixMultipleType, questionChoixMultipleModalStatusType };
