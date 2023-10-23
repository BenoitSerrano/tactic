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
    const [newRightAnswer, setNewRightAnswer] = useState<string[] | undefined>(undefined);
    const [originalPhrase, setOriginalPhrase] = useState(props.rightAnswers[0] || '');
    const words = originalPhrase.split(' ');

    const isResetCombinationDisabled = newRightAnswer?.length === 0;
    let displayedWordsToPlace = [...words];
    if (newRightAnswer) {
        for (const word of newRightAnswer) {
            const wordIndex = displayedWordsToPlace.indexOf(word);
            displayedWordsToPlace.splice(wordIndex, 1);
        }
    }

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
                            {newRightAnswer === undefined && (
                                <tr>
                                    <td>
                                        <Button onClick={() => setNewRightAnswer([])}>
                                            Ajouter
                                        </Button>
                                    </td>
                                    <td />
                                </tr>
                            )}
                            <tr></tr>
                            {newRightAnswer !== undefined && (
                                <tr>
                                    <td>
                                        <CorrectPhraseCreationContainer>
                                            <WordLinesContainer>
                                                <WordLineContainer>
                                                    {displayedWordsToPlace.map((word, index) => (
                                                        <WordContainer
                                                            key={index + word}
                                                            onClick={buildOnClickOnWordToPlace(
                                                                index,
                                                            )}
                                                        >
                                                            <Typography>{word}</Typography>
                                                        </WordContainer>
                                                    ))}
                                                </WordLineContainer>
                                                <WordLineContainer>
                                                    <SubdirectoryArrowRightIcon />
                                                    <Typography>
                                                        {newRightAnswer.join(' ')}
                                                        {' ___'.repeat(
                                                            words.length - newRightAnswer.length,
                                                        )}
                                                    </Typography>
                                                </WordLineContainer>
                                            </WordLinesContainer>
                                        </CorrectPhraseCreationContainer>
                                    </td>
                                    <td>
                                        <IconButton
                                            color="error"
                                            onClick={() => setNewRightAnswer(undefined)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={isResetCombinationDisabled}
                                            color="warning"
                                            onClick={() => setNewRightAnswer([])}
                                        >
                                            <RefreshIcon />
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

    function buildOnClickOnWordToPlace(index: number) {
        return () => {
            if (!newRightAnswer) {
                return;
            }
            setNewRightAnswer([...newRightAnswer, displayedWordsToPlace[index]]);

            if (newRightAnswer.length + 1 === words.length) {
                props.setRightAnswers([...props.rightAnswers, newRightAnswer.join(' ')]);
                setNewRightAnswer(undefined);
            }
        };
    }

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
