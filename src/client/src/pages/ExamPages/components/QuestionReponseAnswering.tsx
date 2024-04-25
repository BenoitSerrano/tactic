import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';
import { useState } from 'react';

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
            <StyledTextField
                fullWidth
                variant="outlined"
                value={localAnswer}
                onBlur={onBlur}
                onChange={onChangeAnswer}
                placeholder="..."
            />
        </StyledContainer>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setLocalAnswer(event.target.value);
    }

    function onBlur() {
        props.setCurrentAnswer(localAnswer);
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
});

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginTop: theme.spacing(1),
}));

const Title = styled(Typography)({ fontWeight: 'bold' });
export { QuestionReponseAnswering };
