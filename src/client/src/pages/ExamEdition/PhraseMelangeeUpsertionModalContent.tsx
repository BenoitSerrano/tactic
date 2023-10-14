import React, { useState } from 'react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Button, TextField, Typography, styled } from '@mui/material';
import { combinator } from '../../lib/combinator';

function PhraseMelangeeUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
}) {
    const [correctCombination, setCorrectCombination] = useState<number[]>([]);
    const [originalPhrase, setOriginalPhrase] = useState(props.rightAnswers[0] || '');
    const words = originalPhrase.split(' ');

    const isAddCombinationDisabled =
        correctCombination.length !== words.length ||
        props.rightAnswers.includes(correctCombination.map((index) => words[index]).join(' '));

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
                        <ul>
                            {props.rightAnswers.map((rightAnswer) => (
                                <li key={rightAnswer}>
                                    <Typography>{rightAnswer}</Typography>
                                </li>
                            ))}
                            <li>
                                <CorrectPhraseCreationContainer>
                                    <WordLinesContainer>
                                        <WordLineContainer>
                                            {words.map((word, index) =>
                                                correctCombination.includes(index) ? undefined : (
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
                                            {correctCombination.map((combinationIndex, index) => (
                                                <WordContainer
                                                    key={index}
                                                    onClick={buildOnClickOnCorrectPhraseWord(index)}
                                                >
                                                    <Typography>
                                                        {words[combinationIndex]}
                                                    </Typography>
                                                </WordContainer>
                                            ))}
                                        </WordLineContainer>
                                    </WordLinesContainer>
                                    <Button
                                        onClick={validateCorrectPhrase}
                                        disabled={isAddCombinationDisabled}
                                    >
                                        Ajouter
                                    </Button>
                                </CorrectPhraseCreationContainer>
                            </li>
                        </ul>
                    </>
                </MainContainer>
            )}
        </>
    );

    function buildOnClickOnCorrectPhraseWord(index: number) {
        return () => {
            const newCorrectCombination = [...correctCombination];
            newCorrectCombination.splice(index, 1);
            setCorrectCombination(newCorrectCombination);
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

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const originalPhrase = event.target.value;
        setOriginalPhrase(originalPhrase);
        props.setTitle(originalPhrase);
        props.setRightAnswers([originalPhrase]);
    }

    function validateCorrectPhrase() {
        const newRightAnswer = correctCombination.map((index) => words[index]).join(' ');
        props.setRightAnswers([...props.rightAnswers, newRightAnswer]);
        setCorrectCombination([]);
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
