import React, { useState } from 'react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
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
    const initialRightAnswers = props.rightAnswers[0] || '';
    const [newRightAnswer, setNewRightAnswer] = useState<string[] | undefined>(undefined);
    const [originalPhrase, setOriginalPhrase] = useState(initialRightAnswers);
    const [displayedWordsToPlace, setDisplayedWordsToPlace] = useState(
        initialRightAnswers.split(' '),
    );
    const words = originalPhrase.split(' ');

    const isResetCombinationDisabled = newRightAnswer?.length === 0;

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
                                        <Button onClick={resetNewRightAnswer}>Ajouter</Button>
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
                                        <IconButton color="error" onClick={deleteNewRightAnswer}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={isResetCombinationDisabled}
                                            color="warning"
                                            onClick={resetNewRightAnswer}
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
            const updatedNewRightAnswer = [...newRightAnswer, displayedWordsToPlace[index]];

            if (newRightAnswer.length + 1 === words.length) {
                props.setRightAnswers([...props.rightAnswers, updatedNewRightAnswer.join(' ')]);
                setNewRightAnswer(undefined);
                setDisplayedWordsToPlace(originalPhrase.split(' '));
            } else {
                setNewRightAnswer(updatedNewRightAnswer);
                const newDisplayedWordsToPlace = [...displayedWordsToPlace];
                newDisplayedWordsToPlace.splice(index, 1);

                setDisplayedWordsToPlace(newDisplayedWordsToPlace);
            }
        };
    }

    function resetNewRightAnswer() {
        setNewRightAnswer([]);
        setDisplayedWordsToPlace(originalPhrase.split(' '));
    }

    function deleteNewRightAnswer() {
        setNewRightAnswer(undefined);
        setDisplayedWordsToPlace(originalPhrase.split(' '));
    }

    function shufflePhrase() {
        setOriginalPhrase(originalPhrase.trim());
        const shuffledPhrase = computeShuffledPhrase(originalPhrase);
        props.setTitle(shuffledPhrase);
    }

    function computeShuffledPhrase(originalPhrase: string) {
        const words = originalPhrase.trim().split(' ');
        const shuffledCombination = combinator.generate(words.length);
        const shuffledWords = [];
        for (let i = 0; i < shuffledCombination.length; i++) {
            shuffledWords.push(words[shuffledCombination[i]]);
        }
        return shuffledWords.join(' ');
    }

    function buildDeleteRightAnswer(index: number) {
        return () => {
            const newRightAnswers = [...props.rightAnswers];
            newRightAnswers.splice(index, 1);
            props.setRightAnswers(newRightAnswers);
        };
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const newOriginalPhrase = event.target.value;
        setOriginalPhrase(newOriginalPhrase);
        const shuffledPhrase = computeShuffledPhrase(newOriginalPhrase);

        props.setTitle(shuffledPhrase);
        props.setRightAnswers([newOriginalPhrase.trim()]);
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
    flexWrap: 'wrap',
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
