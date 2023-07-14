import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { TextField, styled } from '@mui/material';

type questionTrouType = {
    id: number;
    title: string;
    acceptableAnswers: string[];
    rightAnswers: string[];
    points: number;
    beforeText: string;
    afterText: string;
};

type questionTrouModalStatusType =
    | { kind: 'editing'; questionTrou: questionTrouType }
    | { kind: 'creating' };

function QuestionTrouUpsertionModal(props: {
    close: () => void;
    modalStatus: questionTrouModalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();

    const updateQuestionTrouMutation = useMutation({
        mutationFn: api.updateQuestionTrou,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createQuestionTrouMutation = useMutation({
        mutationFn: api.createQuestionTrou,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.questionTrou.points}` : '1.0',
    );
    const [rightAnswers, setRightAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.questionTrou.rightAnswers.join(', ')
            : '',
    );
    const [acceptableAnswers, setAcceptableAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.questionTrou.acceptableAnswers.join(', ')
            : '',
    );

    const [beforeText, setBeforeText] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.questionTrou.beforeText : '',
    );
    const [afterText, setAfterText] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.questionTrou.afterText : '',
    );

    const isUpdating = updateQuestionTrouMutation.isLoading;
    const isCreating = createQuestionTrouMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestionTrou}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
        >
            <>
                <PhraseContainer>
                    <TextField
                        fullWidth
                        label="Début du texte..."
                        value={beforeText}
                        onChange={(event) => setBeforeText(event.target.value)}
                        placeholder="..."
                    />
                    <TextField
                        label="Bonne réponse"
                        placeholder="..."
                        value={rightAnswers}
                        onChange={(event) => setRightAnswers(event.target.value)}
                    />
                    <TextField
                        fullWidth
                        label="... suite du texte"
                        value={afterText}
                        onChange={(event) => setAfterText(event.target.value)}
                        placeholder="..."
                    />
                </PhraseContainer>

                <TextField
                    fullWidth
                    label="Réponses acceptables"
                    placeholder="Ecrivez les réponses acceptables, séparées par des virgules"
                    value={acceptableAnswers}
                    onChange={(event) => setAcceptableAnswers(event.target.value)}
                />
                <TextField
                    value={points}
                    onChange={onChangePoint}
                    label="Point(s) pour la question"
                />
            </>
        </Modal>
    );

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(/^[0-9]+(\.)?([0-9]+)?$/)) {
            setPoints(value);
        }
    }

    function computeConfirmButtonLabel(modalStatus: questionTrouModalStatusType) {
        switch (modalStatus.kind) {
            case 'creating':
                return 'Créer';
            case 'editing':
                return 'Modifier';
        }
    }

    function saveQuestionTrou() {
        const newQuestionTrou = {
            beforeText,
            points: Number(points),
            afterText,
            rightAnswers: rightAnswers.split(',').map((rightAnswer) => rightAnswer.trim()),
            acceptableAnswers: acceptableAnswers
                .split(',')
                .map((acceptableAnswer) => acceptableAnswer.trim()),
        };
        if (props.modalStatus?.kind === 'editing') {
            updateQuestionTrouMutation.mutate({
                examId: props.examId,
                questionTrouId: props.modalStatus.questionTrou.id,
                ...newQuestionTrou,
            });
        } else {
            createQuestionTrouMutation.mutate({
                examId: props.examId,
                ...newQuestionTrou,
            });
        }
    }
}

const PhraseContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
});

export { QuestionTrouUpsertionModal };

export type { questionTrouType, questionTrouModalStatusType };
