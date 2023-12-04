import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
    Step,
    StepLabel,
    Stepper,
    TextField,
    styled,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Modal } from '../../components/Modal';
import { api } from '../../lib/api';
import { useAlert } from '../../lib/alert';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { questionKindType, questionKinds } from '../../types';
import { questionUpsertionModalContentComponentMapping } from './constants';
import { computeIsConfirmDisabled } from './lib/computeIsConfirmDisabled';
import { FLOATING_NUMBER_REGEX, questionSpecificityMapping } from '../../constants';
import { computeInitialModalQuestionKind } from './lib/computeInitialModalQuestionKind';
import { computeSteps, stepIds } from './lib/computeSteps';

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

    const [activeStep, setActiveStep] = useState(0);

    const steps = computeSteps();

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
                            onClick={handlePreviousClick}
                            disabled={isPreviousButtonDisabled}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </ArrowContainer>
                    <StepContentContainer>{renderStepContent()}</StepContentContainer>
                    <ArrowContainer>
                        <IconButton onClick={handleNextClick} disabled={isNextButtonDisabled}>
                            <ArrowForwardIcon />
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
                    <Step key={`step-${stepId}`} active={activeStep === index}>
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
                    <>
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
                    </>
                );
            case 'EDIT_QUESTION_CONTENT':
                return (
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
                );
            case 'EDIT_QUESTION_POINTS':
                return (
                    <RowContainer>
                        <PointsContainer>
                            <TextField
                                value={points}
                                onChange={onChangePoint}
                                label="Point(s) pour la question"
                            />
                        </PointsContainer>
                    </RowContainer>
                );
        }
    }

    function computeIsNextButtonDisabled() {
        if (activeStep === stepIds.length - 1) {
            return true;
        }

        return false;
    }

    function computeIsPreviousButtonDisabled() {
        if (activeStep === 0) {
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

const ArrowContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
const PointsContainer = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
});

export { QuestionUpsertionModal };
