import React, { useState } from 'react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckIcon from '@mui/icons-material/Check';
import { IconButton, TextField, Typography, styled } from '@mui/material';
import { combinator } from '../../lib/combinator';
import { Button } from '../../components/Button';

function PhraseMelangeeUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
}) {
    const [correctCombination, setCorrectCombination] = useState<number[] | undefined>();
    const [originalPhrase, setOriginalPhrase] = useState(props.rightAnswers[0] || '');
    const words = originalPhrase.split(' ');

    const isValidateCombinationDisabled =
        !correctCombination ||
        correctCombination.length !== words.length ||
        props.rightAnswers.includes(correctCombination.map((index) => words[index]).join(' '));

    const isResetCombinationDisabled = correctCombination?.length === 0;

    return (
        <>
            <TextField
                fullWidth
                label="Phrase originale"
                placeholder="..."
                value={originalPhrase}
                onChange={onChangeOriginalPhrase}
            />
            {!!originalPhrase && (
                <MainContainer>
                    <RowContainer>
                        <Typography>
                            Phrase mélangée : <strong>{props.title}</strong>
                        </Typography>
                        <Button onClick={shufflePhrase}>Mélanger</Button>
                    </RowContainer>
                    <>
                        <Typography>Phrases correctes :</Typography>
                        <table>
                            {props.rightAnswers.map((rightAnswer, index) => (
                                <tr key={rightAnswer}>
                                    <td>
                                        <Typography>{rightAnswer}</Typography>
                                    </td>
                                    <td>
                                        <IconButton
                                            color="error"
                                            onClick={buildDeleteRightAnswer(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            {correctCombination === undefined && (
                                <tr>
                                    <td>
                                        <Button onClick={() => setCorrectCombination([])}>
                                            Ajouter
                                        </Button>
                                    </td>
                                    <td />
                                </tr>
                            )}
                            <tr></tr>
                            {correctCombination !== undefined && (
                                <tr>
                                    <td>
                                        <CorrectPhraseCreationContainer>
                                            <WordLinesContainer>
                                                <WordLineContainer>
                                                    {words.map((word, index) =>
                                                        correctCombination.includes(
                                                            index,
                                                        ) ? undefined : (
                                                            <WordContainer
                                                                key={word}
                                                                onClick={() =>
                                                                    setCorrectCombination([
                                                                        ...correctCombination,
                                                                        index,
                                                                    ])
                                                                }
                                                            >
                                                                <Typography>{word}</Typography>
                                                            </WordContainer>
                                                        ),
                                                    )}
                                                </WordLineContainer>
                                                <WordLineContainer>
                                                    <SubdirectoryArrowRightIcon />
                                                    <Typography>
                                                        {correctCombination
                                                            .map(
                                                                (combinationIndex) =>
                                                                    words[combinationIndex],
                                                            )
                                                            .join(' ')}
                                                        {' ___'.repeat(
                                                            words.length -
                                                                correctCombination.length,
                                                        )}
                                                    </Typography>
                                                </WordLineContainer>
                                            </WordLinesContainer>
                                        </CorrectPhraseCreationContainer>
                                    </td>
                                    <td>
                                        <IconButton
                                            color="error"
                                            onClick={() => setCorrectCombination(undefined)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={isResetCombinationDisabled}
                                            color="warning"
                                            onClick={() => setCorrectCombination([])}
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                        <IconButton
                                            color="success"
                                            onClick={validateCorrectPhrase}
                                            disabled={isValidateCombinationDisabled}
                                        >
                                            <CheckIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            )}
                        </table>
                    </>
                </MainContainer>
            )}
        </>
    );

    function shufflePhrase() {
        setOriginalPhrase(originalPhrase.trim());
        const words = originalPhrase.trim().split(' ');
        const shuffledCombination = combinator.generate(words.length);
        const shuffledWords = [];
        for (let i = 0; i < shuffledCombination.length; i++) {
            shuffledWords.push(words[shuffledCombination[i]]);
        }
        props.setTitle(shuffledWords.join(' '));
    }

    function buildDeleteRightAnswer(index: number) {
        return () => {
            const newRightAnswers = [...props.rightAnswers];
            newRightAnswers.splice(index, 1);
            props.setRightAnswers(newRightAnswers);
        };
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const originalPhrase = event.target.value;
        setOriginalPhrase(originalPhrase);
        props.setTitle(originalPhrase);
        props.setRightAnswers([originalPhrase]);
    }

    function validateCorrectPhrase() {
        if (!correctCombination) {
            return;
        }
        const newRightAnswer = correctCombination.map((index) => words[index]).join(' ');
        props.setRightAnswers([...props.rightAnswers, newRightAnswer]);
        setCorrectCombination(undefined);
    }
}

const MainContainer = styled('div')({ width: '100%' });

const RowContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const CorrectPhraseCreationContainer = styled('div')({
    display: 'flex',
});

const WordLineContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
});
const WordLinesContainer = styled('div')({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
});
const WordContainer = styled('span')({
    borderWidth: '1px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    cursor: 'pointer',
});
export { PhraseMelangeeUpsertionModalContent };
