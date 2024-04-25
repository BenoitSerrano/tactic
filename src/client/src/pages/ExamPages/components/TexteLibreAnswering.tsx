import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../types';
import { useState } from 'react';

function TexteLibreAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [localAnswer, setLocalAnswer] = useState(props.currentAnswer);

    return (
        <Container>
            <TitleContainer>
                <Typography>
                    <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
                </Typography>
            </TitleContainer>
            <StyledTextField
                onBlur={onBlur}
                multiline
                placeholder="..."
                value={localAnswer}
                onChange={onChangeAnswer}
            />
        </Container>
    );

    function onChangeAnswer(event: React.ChangeEvent<HTMLInputElement>) {
        setLocalAnswer(event.target.value);
    }

    function onBlur() {
        if (localAnswer !== props.currentAnswer) {
            props.setCurrentAnswer(localAnswer);
        }
    }
}

const TitleContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));
const StyledTextField = styled(TextField)({ flex: 1 });
const IndexContainer = styled('span')({ fontWeight: 'bold' });
const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
});
export { TexteLibreAnswering };
