import { IconButton, TextField, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useState } from 'react';
import { computeTexteATrousState } from './lib/computeTexteATrousState';
import { textSplitter } from '../../lib/textSplitter';
import { acceptableAnswerType } from '../../types';
import { FLOATING_NUMBER_REGEX } from '../../constants';
import { QuestionInputContainer } from './QuestionInputContainer';

function TexteATrousUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (newAcceptableAnswerWithPoints: acceptableAnswerType[][]) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const initialPointsPerBlank = props.acceptableAnswers.length
        ? Number(props.points) / props.acceptableAnswers.length
        : Number(props.points);
    const [pointsPerBlank, setPointsPerBlank] = useState(`${initialPointsPerBlank}`);
    const [isWholeSentenceFrozen, setIsWholeSentenceFrozen] = useState(!!props.title);
    const words = textSplitter.split(props.title);

    return (
        <>
            <QuestionInputContainer title="Texte complet">
                <RowContainer>
                    <TextField
                        autoFocus
                        disabled={isWholeSentenceFrozen}
                        fullWidth
                        multiline
                        label="Texte complet"
                        value={props.title}
                        onChange={(event) => props.setTitle(event.target.value)}
                    />
                    {isWholeSentenceFrozen ? (
                        <IconButton color="warning" onClick={resetWholeSentence}>
                            <RefreshIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            color="success"
                            disabled={!props.title}
                            onClick={() => setIsWholeSentenceFrozen(true)}
                        >
                            <CheckIcon />
                        </IconButton>
                    )}
                </RowContainer>
            </QuestionInputContainer>
            {isWholeSentenceFrozen && (
                <QuestionInputContainer
                    title="Texte à trous"
                    subtitle="Cliquez sur les mots à cacher dans le texte ci-dessous"
                >
                    <WordPickingContainer>
                        <WordsContainer>
                            {words.map((word, index) => (
                                <WordContainer onClick={buildOnClickOnWord(index)}>
                                    {word}
                                </WordContainer>
                            ))}
                        </WordsContainer>
                    </WordPickingContainer>
                </QuestionInputContainer>
            )}
            <QuestionInputContainer isLastItem title="Nombre de points attribués à chaque trou">
                <TextField
                    value={pointsPerBlank}
                    onChange={onChangePointPerBlank}
                    label="Point(s) par trou"
                />
            </QuestionInputContainer>
        </>
    );

    function onChangePointPerBlank(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setPointsPerBlank(value);
            props.setPoints(`${Number(value) * props.acceptableAnswers.length}`);
        }
    }

    function resetWholeSentence() {
        setIsWholeSentenceFrozen(false);
        props.setTitle('');
        props.setAcceptableAnswers([]);
        props.setPoints('0');
    }

    function buildOnClickOnWord(wordIndex: number) {
        return () => {
            const nextState = computeTexteATrousState(wordIndex, {
                title: props.title,
                rightAnswers: props.acceptableAnswers.map(
                    (acceptableAnswersPerBlank) => acceptableAnswersPerBlank[0].answer,
                ),
            });
            props.setTitle(nextState.title);
            props.setAcceptableAnswers(
                nextState.rightAnswers.map((answer) => [
                    {
                        answer,
                        grade: 'A',
                    },
                ]),
            );
            props.setPoints(`${Number(pointsPerBlank) * nextState.rightAnswers.length}`);
        };
    }
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const WordsContainer = styled('div')({ display: 'flex', flexWrap: 'wrap' });
const WordPickingContainer = styled('div')({});
const WordContainer = styled(Typography)(({ theme }) => ({
    textDecorationLine: 'underline',
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
}));

export { TexteATrousUpsertionModalContent };
