import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { questionWithoutAnswerType } from '../../types';
import { SPLITTING_CHARACTER_FOR_TAT, converter } from '../../lib/converter';
import { textSplitter } from '../../../../lib/textSplitter';

const WORD_WIDTH = 100;

function TexteATrousAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const { title } = props.question;
    const words = textSplitter.split(title);
    const textInputs = converter.convertAnswerToTextInputs({
        currentAnswer: props.currentAnswer,
        title,
    });
    return (
        <>
            <Typography>
                <WordsContainer>
                    <IndexContainer>{props.index}.</IndexContainer>
                    {words.map((word, wordIndex) =>
                        word === '....' ? (
                            <AnswerTextField
                                placeholder="..."
                                value={
                                    textInputs[
                                        converter.convertWordIndexToAnswerIndex({
                                            wordIndex,
                                            title,
                                        })
                                    ]
                                }
                                onChange={buildSetWordAnswer(wordIndex)}
                                variant="outlined"
                            />
                        ) : (
                            <WordContainer>{word}</WordContainer>
                        ),
                    )}
                </WordsContainer>
            </Typography>
        </>
    );

    function buildSetWordAnswer(wordIndex: number) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const textInput = event.target.value;
            if (textInput.includes(SPLITTING_CHARACTER_FOR_TAT)) {
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

const WordsContainer = styled('div')({ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' });
const WordContainer = styled(Typography)(({ theme }) => ({
    paddingRight: 4,
    paddingLeft: 4,
}));
const IndexContainer = styled('span')({ fontWeight: 'bold' });
const AnswerTextField = styled(TextField)({ width: WORD_WIDTH });
export { TexteATrousAnswering };
