import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TextField, styled } from '@mui/material';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';

type questionTrouType = {
    id: number;
    title: string;
    acceptableAnswers: string[];
    rightAnswers: string[];
    points: number;
    beforeText: string;
    afterText: string;
};

type questionTrouModalStatusType = modalStatusType<questionTrouType>;

function QuestionTrouUpsertionModal(props: {
    close: () => void;
    modalStatus: questionTrouModalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const updateQuestionTrouMutation = useMutation({
        mutationFn: api.updateQuestionTrou,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createQuestionTrouMutation = useMutation({
        mutationFn: api.createQuestionTrou,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.points}` : '1.0',
    );
    const [rightAnswers, setRightAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.question.rightAnswers.join(', ')
            : '',
    );
    const [acceptableAnswers, setAcceptableAnswers] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.question.acceptableAnswers.join(', ')
            : '',
    );

    const [beforeText, setBeforeText] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.beforeText : '',
    );
    const [afterText, setAfterText] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.afterText : '',
    );

    const isUpdating = updateQuestionTrouMutation.isLoading;
    const isCreating = createQuestionTrouMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={saveQuestionTrou}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'un texte à trou`}
        >
            <>
                <RowContainer>
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
                </RowContainer>
                <RowContainer>
                    <TextField
                        fullWidth
                        label="Réponses acceptables"
                        placeholder="Ecrivez les réponses acceptables, séparées par des virgules"
                        value={acceptableAnswers}
                        onChange={(event) => setAcceptableAnswers(event.target.value)}
                    />
                </RowContainer>
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
                questionTrouId: props.modalStatus.question.id,
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

export { QuestionTrouUpsertionModal };

export type { questionTrouType, questionTrouModalStatusType };
