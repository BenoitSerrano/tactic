import { IconButton, TextField, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useState } from 'react';
import { computeTexteATrousState } from './lib/computeTexteATrousState';
import { textSplitter } from '../../lib/textSplitter';
import { acceptableAnswerWithPointsType } from '../../types';
import { FLOATING_NUMBER_REGEX } from '../../constants';

function TexteATrousUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
    setAcceptableAnswersWithPoints: (
        newAcceptableAnswerWithPoints: acceptableAnswerWithPointsType[],
    ) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const initialPointsPerBlank = props.acceptableAnswersWithPoints.length
        ? Number(props.points) / props.acceptableAnswersWithPoints.length
        : Number(props.points);
    const [pointsPerBlank, setPointsPerBlank] = useState(`${initialPointsPerBlank}`);
    const [isWholeSentenceFrozen, setIsWholeSentenceFrozen] = useState(!!props.title);
    const words = textSplitter.split(props.title);

    return (
        <>
            <RowContainer>
                <TextField
                    disabled={isWholeSentenceFrozen}
                    fullWidth
                    multiline
                    label="Phrase complète"
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
            {isWholeSentenceFrozen && (
                <RowContainer>
                    <WordPickingContainer>
                        <Typography>
                            Sélectionnez les mots à cacher dans la phrase ci-dessous :
                        </Typography>
                        <WordsContainer>
                            {words.map((word, index) => (
                                <WordContainer onClick={buildOnClickOnWord(index)}>
                                    {word}
                                </WordContainer>
                            ))}
                        </WordsContainer>
                    </WordPickingContainer>
                </RowContainer>
            )}
            <RowContainer>
                <TextField
                    value={pointsPerBlank}
                    onChange={onChangePointPerBlank}
                    label="Point(s) par trou"
                />
            </RowContainer>
        </>
    );

    function onChangePointPerBlank(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setPointsPerBlank(value);
            const newPointsPerBlank = Number(value);
            props.setAcceptableAnswersWithPoints(
                props.acceptableAnswersWithPoints.map(({ answer }) => ({
                    answer,
                    points: newPointsPerBlank,
                })),
            );
            props.setPoints(`${Number(value) * props.acceptableAnswersWithPoints.length}`);
        }
    }

    function resetWholeSentence() {
        setIsWholeSentenceFrozen(false);
        props.setTitle('');
        props.setAcceptableAnswersWithPoints([]);
        props.setPoints('0');
    }

    function buildOnClickOnWord(wordIndex: number) {
        return () => {
            const nextState = computeTexteATrousState(wordIndex, {
                title: props.title,
                rightAnswers: props.acceptableAnswersWithPoints.map(({ answer }) => answer),
            });
            props.setTitle(nextState.title);
            props.setAcceptableAnswersWithPoints(
                nextState.rightAnswers.map((answer) => ({
                    answer,
                    points: Number(pointsPerBlank),
                })),
            );
            props.setPoints(`${Number(pointsPerBlank) * nextState.rightAnswers.length}`);
        };
    }
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 1,
    width: '100%',
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
