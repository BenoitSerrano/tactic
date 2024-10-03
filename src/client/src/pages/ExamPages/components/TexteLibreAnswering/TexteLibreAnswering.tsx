import { Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from '../../types';
import { useState } from 'react';
import { AutoBlurringTextField } from '../AutoBlurringTextField';
import { WordCount } from './WordCount';

function TexteLibreAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string | undefined;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [localAnswer, setLocalAnswer] = useState(props.currentAnswer || '');
    return (
        <Container>
            <TitleContainer>
                <Typography>
                    <IndexContainer>{props.index}</IndexContainer>. {props.question.title}
                </Typography>
            </TitleContainer>
            <TextFieldContainer>
                <AutoBlurringTextField
                    isFullWidth
                    onBlur={onBlur}
                    onChange={setLocalAnswer}
                    isMultiline
                    value={localAnswer}
                />
                <WordCount text={localAnswer} />
            </TextFieldContainer>
        </Container>
    );

    function onBlur() {
        if (localAnswer !== props.currentAnswer) {
            props.setCurrentAnswer(localAnswer);
        }
    }
}

const TitleContainer = styled('div')(({ theme }) => ({ marginRight: theme.spacing(2) }));

const IndexContainer = styled('span')({ fontWeight: 'bold' });
const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
});

const TextFieldContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
}));
export { TexteLibreAnswering };
