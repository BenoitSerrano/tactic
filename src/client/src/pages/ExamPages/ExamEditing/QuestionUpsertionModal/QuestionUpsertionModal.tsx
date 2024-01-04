import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { questionUpsertionModalStatusType } from '../types';
import { questionKindType } from '../../../../types';
import { useAlert } from '../../../../lib/alert';
import { api } from '../../../../lib/api';
import { questionUpsertionModalContentComponentMapping } from '../constants';
import { computeConfirmButtonLabel, computeModalTitlePrefix } from '../utils';
import { computeIsConfirmDisabled } from '../lib/computeIsConfirmDisabled';
import { Modal } from '../../../../components/Modal';
import { QuestionKindSelect } from '../../components/QuestionKindSelect';
import { FLOATING_NUMBER_REGEX } from '../../../../constants';

const DEFAULT_POSSIBLE_ANSWERS = ['', ''];

function QuestionUpsertionModal(props: {
    close: () => void;
    defaultQuestionKind: questionKindType;
    modalStatus: questionUpsertionModalStatusType;
    examId: string;
    exerciseId: number;
    defaultPoints: number;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [currentQuestionKind, setCurrentQuestionKind] = useState<questionKindType>(
        props.defaultQuestionKind,
    );

    const updateQuestionMutation = useMutation({
        mutationFn: api.updateQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
        },
    });

    const createQuestionMutation = useMutation({
        mutationFn: api.createQuestion,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({
                queryKey: ['exam-with-questions', props.examId],
            });
        },
    });

    const QuestionUpsertionModalContentComponent =
        questionUpsertionModalContentComponentMapping[currentQuestionKind];

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing'
            ? `${props.modalStatus.question.points}`
            : `${props.defaultPoints}`,
    );

    const [title, setTitle] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.title}` : '',
    );
    const [acceptableAnswers, setAcceptableAnswers] = useState(
        props.modalStatus.kind === 'editing' ? props.modalStatus.question.acceptableAnswers : [],
    );

    const [possibleAnswers, setPossibleAnswers] = useState(
        props.modalStatus.kind === 'editing' && props.modalStatus.question.possibleAnswers
            ? props.modalStatus.question.possibleAnswers
            : DEFAULT_POSSIBLE_ANSWERS,
    );

    const isUpdating = updateQuestionMutation.isPending;
    const isCreating = createQuestionMutation.isPending;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);
    const isConfirmDisabled = computeIsConfirmDisabled(currentQuestionKind, {
        title,
        acceptableAnswers,
        possibleAnswers,
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
            <ModalContentContainer>
                <QuestionKindSelect
                    currentQuestionKind={currentQuestionKind}
                    onSelect={onSelectQuestionKind}
                />
                <QuestionUpsertionModalContentComponent
                    title={title}
                    setTitle={setTitle}
                    acceptableAnswers={acceptableAnswers}
                    setAcceptableAnswers={setAcceptableAnswers}
                    possibleAnswers={possibleAnswers}
                    setPossibleAnswers={setPossibleAnswers}
                    points={points}
                    setPoints={onChangePoints}
                />
            </ModalContentContainer>
        </Modal>
    );

    function onSelectQuestionKind(questionKind: questionKindType) {
        if (questionKind !== currentQuestionKind) {
            resetQuestionContent();
            setCurrentQuestionKind(questionKind);
        }
    }

    function onChangePoints(points: string) {
        if (points.match(FLOATING_NUMBER_REGEX)) {
            setPoints(points);
        }
    }

    function resetQuestionContent() {
        setAcceptableAnswers([]);
        setPossibleAnswers(DEFAULT_POSSIBLE_ANSWERS);
        setTitle('');
        setPoints(`${props.defaultPoints}`);
    }

    function saveQuestion() {
        const { modalStatus } = props;
        if (!modalStatus) {
            return;
        }
        const newQuestion = {
            points: Number(points),
            title,
            kind: currentQuestionKind,
            possibleAnswers:
                currentQuestionKind === 'qcm'
                    ? possibleAnswers.map((possibleAnswer) => possibleAnswer.trim())
                    : [],
            acceptableAnswers,
        };
        if (modalStatus.kind === 'editing') {
            updateQuestionMutation.mutate({
                examId: props.examId,
                exerciseId: props.exerciseId,
                questionId: modalStatus.question.id,
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

const ModalContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    flex: 1,
});

export { QuestionUpsertionModal };
