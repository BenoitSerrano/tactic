import { Typography, styled } from '@mui/material';
import { useState } from 'react';
import { questionWithoutAnswerType } from '../../types';
import { SPLITTING_CHARACTER_FOR_TAT, converter } from '../../lib/converter';
import { textSplitter } from '../../../../lib/textSplitter';
import { BLANK_TEXT_FIELD_WIDTH } from '../../constants';
import { AutoBlurringTextField } from '../AutoBlurringTextField';
import { TAT_BLANK_STRING } from '../../../../constants';
import { computeShouldDisplaySpaceBeforeCharacter } from '../../ExamEditingContent/QuestionPreviewing/TexteATrous/lib/shouldDisplaySpaceBeforeCharacter';

function TexteATrousAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [localAnswer, setLocalAnswer] = useState(props.currentAnswer);
    const { title } = props.question;
    const words = textSplitter.split(title);
    const textInputs = converter.convertAnswerToTextInputs({
        currentAnswer: localAnswer,
        title,
    });

    return (
        <>
            <Typography>
                <WordsContainer>
                    <IndexContainer>{props.index}.</IndexContainer>
                    {words.map((word, wordIndex) => {
                        if (word === TAT_BLANK_STRING) {
                            return (
                                <AutoBlurringTextField
                                    width={BLANK_TEXT_FIELD_WIDTH}
                                    key={`tat-question-${props.question.id}-word-${wordIndex}-input`}
                                    value={
                                        textInputs[
                                            converter.convertWordIndexToAnswerIndex({
                                                wordIndex,
                                                title,
                                            })
                                        ]
                                    }
                                    onBlur={onBlur}
                                    onChange={buildSetWordAnswer(wordIndex)}
                                />
                            );
                        }
                        const shouldDisplaySpaceBeforeCharacter =
                            computeShouldDisplaySpaceBeforeCharacter(word);
                        return (
                            <WordContainer
                                shouldDisplaySpaceBeforeCharacter={
                                    shouldDisplaySpaceBeforeCharacter
                                }
                                key={`tat-question-${props.question.id}-word-${wordIndex}-text`}
                            >
                                {word}
                            </WordContainer>
                        );
                    })}
                </WordsContainer>
            </Typography>
        </>
    );

    function buildSetWordAnswer(wordIndex: number) {
        return (value: string) => {
            if (value.includes(SPLITTING_CHARACTER_FOR_TAT)) {
                return;
            }
            const answer = converter.convertTextInputToAnswer({
                textInput: value,
                currentAnswer: localAnswer,
                wordIndex,
                title,
            });
            setLocalAnswer(answer);
        };
    }
    function onBlur() {
        if (localAnswer !== props.currentAnswer) {
            props.setCurrentAnswer(localAnswer);
        }
    }
}

const WordsContainer = styled('div')({ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline' });
const WordContainer = styled(Typography)<{ shouldDisplaySpaceBeforeCharacter: boolean }>(
    ({ theme, shouldDisplaySpaceBeforeCharacter }) => ({
        paddingLeft: shouldDisplaySpaceBeforeCharacter ? '4px' : '0px',
    }),
);
const IndexContainer = styled('span')({ fontWeight: 'bold' });
export { TexteATrousAnswering };
