import { Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';
import { useState } from 'react';
import { AutoBlurringTextField } from './AutoBlurringTextField';

function QuestionReponseAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [localAnswer, setLocalAnswer] = useState(props.currentAnswer);
    return (
        <StyledContainer>
            <Title>
                {props.index}. {props.question.title}
            </Title>
            <AutoBlurringTextField
                isFullWidth
                value={localAnswer || ''}
                onBlur={onBlur}
                onChange={setLocalAnswer}
            />
        </StyledContainer>
    );

    function onBlur() {
        if (localAnswer !== props.currentAnswer) {
            props.setCurrentAnswer(localAnswer);
        }
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

const Title = styled(Typography)({ fontWeight: 'bold' });
export { QuestionReponseAnswering };
