import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { IconButton, Step, StepLabel, Stepper, TextField, styled } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { acceptableAnswerWithPointsType, questionKindType } from '../../types';
import { questionUpsertionModalContentComponentMapping } from './constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';
import { FLOATING_NUMBER_REGEX } from '../../constants';
import { computeInitialModalQuestionKind } from './lib/computeInitialModalQuestionKind';
import { computeSteps, stepIds } from './lib/computeSteps';
import { QuestionKindSelect } from '../ExamExercises/QuestionKindSelect';

const DEFAULT_POSSIBLE_ANSWERS = ['', ''];

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

    const minimumStep = props.modalStatus.kind === 'creating' ? 0 : 1;
    const maximumStep = stepIds.length - 1;

    const [activeStep, setActiveStep] = useState(minimumStep);

    const steps = computeSteps();

    const QuestionUpsertionModalContentComponent =
        questionUpsertionModalContentComponentMapping[currentQuestionKind];

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing'
            ? `${props.modalStatus.question.points}`
            : props.defaultPoints,
    );
    const [pointsPerBlank, setPointsPerBlank] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.question.points
            : props.defaultPoints,
    );
    const [title, setTitle] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.title}` : '',
    );
    const [acceptableAnswersWithPoints, setAcceptableAnswersWithPoints] = useState(
        props.modalStatus.kind === 'editing'
            ? props.modalStatus.question.acceptableAnswersWithPoints
            : [],
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
        acceptableAnswersWithPoints,
        possibleAnswers,
    });

    const isNextButtonDisabled = computeIsNextButtonDisabled();
    const isPreviousButtonDisabled = computeIsPreviousButtonDisabled();

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
                {renderStepper()}
                <StepContainer>
                    <ArrowContainer>
                        <IconButton
                            size="large"
                            onClick={handlePreviousClick}
                            disabled={isPreviousButtonDisabled}
                        >
                            <ArrowBackIcon fontSize="large" />
                        </IconButton>
                    </ArrowContainer>
                    <StepContentContainer>{renderStepContent()}</StepContentContainer>
                    <ArrowContainer>
                        <IconButton
                            onClick={handleNextClick}
                            disabled={isNextButtonDisabled}
                            size="large"
                        >
                            <ArrowForwardIcon fontSize="large" />
                        </IconButton>
                    </ArrowContainer>
                </StepContainer>
            </ModalContentContainer>
        </Modal>
    );

    function renderStepper() {
        return (
            <Stepper activeStep={activeStep}>
                {stepIds.map((stepId, index) => (
                    <Step
                        key={`step-${stepId}`}
                        active={activeStep === index}
                        disabled={computeIsStepDisabled(index)}
                    >
                        <StepLabel>{steps[stepId].label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
        );
    }

    function renderStepContent() {
        switch (stepIds[activeStep]) {
            case 'SELECT_QUESTION_KIND':
                return (
                    <QuestionKindSelect
                        currentQuestionKind={currentQuestionKind}
                        onSelect={onSelectQuestionKind}
                    />
                );
            case 'EDIT_QUESTION_CONTENT':
                return (
                    <QuestionUpsertionModalContentComponent
                        title={title}
                        setTitle={setTitle}
                        acceptableAnswersWithPoints={acceptableAnswersWithPoints}
                        setAcceptableAnswersWithPoints={onChangeAcceptableAnswerWithPoints}
                        possibleAnswers={possibleAnswers}
                        setPossibleAnswers={setPossibleAnswers}
                        points={points}
                    />
                );
            case 'EDIT_QUESTION_POINTS':
                return <PointsContainer>{renderPointsInput(currentQuestionKind)}</PointsContainer>;
        }
    }

    function renderPointsInput(questionKind: questionKindType) {
        if (questionKind === 'texteATrous') {
            return (
                <TextField
                    value={pointsPerBlank}
                    onChange={onChangePointPerBlank}
                    label="Point(s) par trou"
                />
            );
        } else {
            return (
                <TextField
                    value={points}
                    onChange={onChangePoint}
                    label="Point(s) pour la question"
                />
            );
        }
    }

    function onChangeAcceptableAnswerWithPoints(
        newAcceptableAnswersWithPoints: acceptableAnswerWithPointsType[],
    ) {
        if (currentQuestionKind === 'texteATrous') {
            setAcceptableAnswersWithPoints(
                newAcceptableAnswersWithPoints.map(({ answer }) => ({
                    answer,
                    points: pointsPerBlank,
                })),
            );
            setPoints(Number(pointsPerBlank) * acceptableAnswersWithPoints.length);
        } else {
            setAcceptableAnswersWithPoints(newAcceptableAnswersWithPoints);
        }
    }

    function onChangePointPerBlank(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setPointsPerBlank(Number(value));
            setPoints(Number(value) * acceptableAnswersWithPoints.length);
        }
    }

    function computeIsStepDisabled(index: number) {
        return index === 0 && props.modalStatus.kind === 'editing';
    }

    function onSelectQuestionKind(questionKind: questionKindType) {
        if (questionKind !== currentQuestionKind) {
            resetQuestionContent();
            setCurrentQuestionKind(questionKind);
            handleNextClick();
        }
        setTimeout(handleNextClick, 100);
    }

    function computeIsNextButtonDisabled() {
        if (activeStep >= maximumStep) {
            return true;
        }

        return false;
    }

    function resetQuestionContent() {
        setAcceptableAnswersWithPoints([]);
        setPossibleAnswers(DEFAULT_POSSIBLE_ANSWERS);
        setTitle('');
        setPoints(props.defaultPoints);
    }

    function computeIsPreviousButtonDisabled() {
        if (activeStep <= minimumStep) {
            return true;
        }
        return false;
    }

    function handleNextClick() {
        setActiveStep(activeStep + 1);
    }

    function handlePreviousClick() {
        setActiveStep(activeStep - 1);
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
            acceptableAnswersWithPoints,
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

const ModalContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    flex: 1,
});

const StepContentContainer = styled('div')({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
});

const StepContainer = styled('div')({
    display: 'flex',
    flex: 1,
    width: '100%',
});

const ArrowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(1),
    alignItems: 'center',
    justifyContent: 'center',
}));
const PointsContainer = styled('div')({
    display: 'flex',
    justifyContent: 'center',
});

export { QuestionUpsertionModal };
