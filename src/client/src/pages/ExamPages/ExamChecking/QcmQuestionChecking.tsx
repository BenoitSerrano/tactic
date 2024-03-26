import { FormControlLabel, Radio, RadioGroup, Typography, styled } from '@mui/material';
import { displayedAnswerType } from '../lib/computeDisplayedAnswer';
import { answerStatusType, qcmWithAnswersType } from '../types';
import { ElementType } from 'react';
import { AcceptableAnswers } from '../components/AcceptableAnswers';
const RightRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: theme.palette.success.main,
    },
}));
const WrongRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: theme.palette.error.main,
    },
}));
const AcceptableRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: theme.palette.warning.main,
    },
}));

const RightFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    '& .MuiFormControlLabel-label.Mui-disabled': {
        color: theme.palette.success.main,
    },
}));
const WrongFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    '& .MuiFormControlLabel-label.Mui-disabled': {
        color: theme.palette.error.main,
    },
}));
const AcceptableFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
    '& .MuiFormControlLabel-label.Mui-disabled': {
        color: theme.palette.warning.main,
    },
}));

const radioAttemptStatusMapping: Record<'right' | 'wrong' | 'acceptable', ElementType> = {
    acceptable: AcceptableRadio,
    wrong: WrongRadio,
    right: RightRadio,
};

const formControlLabelAttemptStatusMapping: Record<'right' | 'wrong' | 'acceptable', ElementType> =
    {
        acceptable: AcceptableFormControlLabel,
        wrong: WrongFormControlLabel,
        right: RightFormControlLabel,
    };

function QcmQuestionChecking(props: {
    index: number;
    displayedAnswer: displayedAnswerType;
    question: qcmWithAnswersType;
    answerStatus: answerStatusType;
    shouldDisplayRightAnswers?: boolean;
}) {
    return (
        <Container>
            <Title>
                {props.index}. {props.question.title}
            </Title>
            <PossibleAnswersContainer>
                <RadioGroup value={props.question.answer}>
                    {props.question.possibleAnswers.map(
                        (possibleAnswer: string, possibleAnswerIndex: number) => {
                            const isChoiceSelected =
                                possibleAnswerIndex === Number(props.question.answer);
                            const StyledRadio =
                                isChoiceSelected && props.answerStatus
                                    ? radioAttemptStatusMapping[props.answerStatus]
                                    : Radio;
                            const StyledFormControlLabel =
                                isChoiceSelected && props.answerStatus
                                    ? formControlLabelAttemptStatusMapping[props.answerStatus]
                                    : FormControlLabel;
                            return (
                                <InputContainer key={'possibleAnswer-' + possibleAnswerIndex}>
                                    <StyledFormControlLabel
                                        disabled
                                        value={`${possibleAnswerIndex}`}
                                        control={<StyledRadio />}
                                        label={`${possibleAnswer}`}
                                    />
                                </InputContainer>
                            );
                        },
                    )}
                </RadioGroup>
            </PossibleAnswersContainer>
            {props.shouldDisplayRightAnswers && (
                <RightAnswersContainer>
                    <AcceptableAnswers
                        grade="A"
                        values={props.displayedAnswer.displayedRightAnswers}
                    />
                </RightAnswersContainer>
            )}
        </Container>
    );
}

const Title = styled(Typography)({ fontWeight: 'bold' });
const PossibleAnswersContainer = styled('div')({});
const InputContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
}));
const RightAnswersContainer = styled('div')(({ theme }) => ({ paddingTop: theme.spacing(2) }));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { QcmQuestionChecking };
