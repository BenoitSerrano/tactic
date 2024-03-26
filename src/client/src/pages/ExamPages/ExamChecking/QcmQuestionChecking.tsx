import { FormControlLabel, Radio, RadioGroup, Typography, styled } from '@mui/material';
import { displayedAnswerType } from '../lib/computeDisplayedAnswer';
import { answerStatusType, qcmWithAnswersType } from '../types';
import { ElementType } from 'react';
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

const radioAttemptStatusMapping: Record<'right' | 'wrong' | 'acceptable', ElementType> = {
    acceptable: AcceptableRadio,
    wrong: WrongRadio,
    right: RightRadio,
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
                            const StyledRadio = props.answerStatus
                                ? radioAttemptStatusMapping[props.answerStatus]
                                : Radio;
                            return (
                                <InputContainer key={'possibleAnswer-' + possibleAnswerIndex}>
                                    <FormControlLabel
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
        </Container>
    );
}

const Title = styled(Typography)({ fontWeight: 'bold' });
const PossibleAnswersContainer = styled('div')({});
const InputContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginTop: theme.spacing(1),
    // marginBottom: theme.spacing(1),
}));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { QcmQuestionChecking };
