import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { styled } from '@mui/material';
import { questionUpsertionModalStatusType } from '../types';
import { questionKindType } from '../../../../types';
import { useAlert } from '../../../../lib/alert';
import { questionUpsertionModalContentComponentMapping } from '../constants';
import { computeConfirmButtonLabel, computeModalTitlePrefix } from '../utils';
import { computeIsConfirmDisabled } from '../lib/computeIsConfirmDisabled';
import { Modal } from '../../../../components/Modal';
import { QuestionKindSelect } from '../../components/QuestionKindSelect';
import { FLOATING_NUMBER_REGEX } from '../../../../constants';
import { questionsApi } from '../../../../lib/api/questionsApi';

const DEFAULT_POSSIBLE_ANSWERS = ['', ''];

function QuestionUpsertionModal(props: {
    close: () => void;
    defaultQuestionKind: questionKindType;
    modalStatus: questionUpsertionModalStatusType;
    examId: string;
    exerciseId: number;
    defaultPoints: number | null;
    onCreateQuestion: (exerciseId: number, questionId: number) => void;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();
    const [currentQuestionKind, setCurrentQuestionKind] = useState<questionKindType>(
        props.modalStatus.kind === 'creating'
            ? props.defaultQuestionKind
            : props.modalStatus.question.kind,
    );

    const updateQuestionMutation = useMutation({
        mutationFn: questionsApi.updateQuestion,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'with-questions'],
            });
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
        },
    });

    const createQuestionMutation = useMutation({
        mutationFn: questionsApi.createQuestion,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['exams', props.examId, 'with-questions'],
            });
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
        },
    });
    const QuestionUpsertionModalContentComponent =
        questionUpsertionModalContentComponentMapping[currentQuestionKind];

    const initialPoints = computeInitialPoints();

    const [points, setPoints] = useState(initialPoints);

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
        points: Number(points),
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
                {props.modalStatus.kind === 'creating' && (
                    <QuestionKindSelect
                        currentQuestionKind={currentQuestionKind}
                        onSelect={onSelectQuestionKind}
                    />
                )}

                <QuestionUpsertionModalContentComponent
                    canEditPoints={props.defaultPoints === null}
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

    function computeInitialPoints() {
        switch (props.modalStatus.kind) {
            case 'creating':
                if (props.defaultPoints === null) {
                    return '';
                } else {
                    return `${props.defaultPoints}`;
                }
            case 'editing':
                return `${props.modalStatus.question.points}`;
        }
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
            acceptableAnswers: acceptableAnswers.filter(Boolean),
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
