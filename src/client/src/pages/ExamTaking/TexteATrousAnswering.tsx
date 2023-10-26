import { TextField, Typography, styled } from '@mui/material';
import { questionWithoutAnswerType } from './types';
import { ChangeEvent } from 'react';
import { converter } from './lib/converter';

function TexteATrousAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const { title } = props.question;
    const words = title.split(' ');
    const textInputs = converter.convertAnswerToTextInputs({
        currentAnswer: props.currentAnswer,
        title,
    });
    return (
        <>
            <TitleContainer>
                <Typography>
                    <IndexContainer>{props.index}</IndexContainer>.{' '}
                    <WordsContainer>
                        {words.map((word, wordIndex) =>
                            word === '....' ? (
                                <TextField
                                    value={
                                        textInputs[
                                            converter.convertWordIndexToAnswerIndex({
                                                wordIndex,
                                                title,
                                            })
                                        ]
                                    }
                                    onChange={buildSetWordAnswer(wordIndex)}
                                    variant="standard"
                                />
                            ) : (
                                <WordContainer>{word}</WordContainer>
                            ),
                        )}
                    </WordsContainer>
                </Typography>
            </TitleContainer>
        </>
    );

    function buildSetWordAnswer(wordIndex: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const textInput = event.target.value;
            if (textInput.includes(' ')) {
                return;
            }
            const answer = converter.convertTextInputToAnswer({
                textInput,
                currentAnswer: props.currentAnswer,
                wordIndex,
                title,
            });
            props.setCurrentAnswer(answer);
        };
    }
}

const TitleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));
const WordsContainer = styled('div')({ display: 'flex', flexWrap: 'wrap' });
const WordContainer = styled(Typography)(({ theme }) => ({
    paddingRight: theme.spacing(1),
}));
const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { TexteATrousAnswering };
