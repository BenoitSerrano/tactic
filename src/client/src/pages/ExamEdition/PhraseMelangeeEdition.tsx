import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { combinator } from '../../lib/combinator';

function PhraseMelangeeEdition(props: {
    examId: string;
    phraseMelangee: {
        id: number;
        correctPhrases: string[];
        shuffledPhrase: string;
        words: string[];
        order: number;
    };
}) {
    const [originalPhrase, setOriginalPhrase] = useState<string>(
        props.phraseMelangee.correctPhrases[0] || '',
    );

    const [shuffledPhrase, setShuffledPhrase] = useState<string>(
        props.phraseMelangee.shuffledPhrase || '',
    );

    const [correctPhrases, setCorrectPhrases] = useState<string[]>(
        props.phraseMelangee.correctPhrases || [],
    );

    const [correctCombination, setCorrectCombination] = useState<number[]>([]);

    const updatePhraseMelangeeMutation = useMutation({
        mutationFn: api.updatePhraseMelangee,
    });

    const words = originalPhrase.trim().split(' ');

    return (
        <div>
            <TextField
                fullWidth
                label="Phrase originale"
                placeholder="..."
                value={originalPhrase}
                onChange={onChangeOriginalPhrase}
            />
            {originalPhrase && (
                <>
                    <RowContainer>
                        <Typography>Phrase mélangée : {shuffledPhrase}</Typography>
                        <Button onClick={shuffle}>Mélanger</Button>
                    </RowContainer>
                    <RowContainer>
                        <Typography>Phrases correctes :</Typography>
                        <ul>
                            {correctPhrases.map((correctPhrase) => (
                                <li key={correctPhrase}>
                                    <Typography>{correctPhrase}</Typography>
                                </li>
                            ))}
                            <li>
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
                                            {word}
                                        </WordContainer>
                                    ),
                                )}
                                DEVIENT
                                {correctCombination.map((combinationIndex, index) => (
                                    <WordContainer onClick={buildOnClickOnCorrectPhraseWord(index)}>
                                        {words[combinationIndex]}
                                    </WordContainer>
                                ))}
                                <Button
                                    onClick={validateCorrectPhrase}
                                    disabled={correctCombination.length !== words.length}
                                >
                                    Valider
                                </Button>
                            </li>
                        </ul>
                    </RowContainer>
                </>
            )}

            <Button variant="outlined" onClick={savePhraseMelangee}>
                Sauvegarder
            </Button>
        </div>
    );

    function buildOnClickOnCorrectPhraseWord(index: number) {
        return () => {
            const newCorrectCombination = [...correctCombination];
            newCorrectCombination.splice(index, 1);
            setCorrectCombination(newCorrectCombination);
        };
    }

    function savePhraseMelangee() {
        updatePhraseMelangeeMutation.mutate({
            examId: props.examId,
            phraseMelangeeId: props.phraseMelangee.id,
            correctPhrases,
            shuffledPhrase,
            words,
        });
    }

    function validateCorrectPhrase() {
        const newCorrectPhrase = correctCombination.map((index) => words[index]).join(' ');
        setCorrectPhrases([...correctPhrases, newCorrectPhrase]);
        setCorrectCombination([]);
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const originalPhrase = event.target.value;
        setOriginalPhrase(originalPhrase);
        setShuffledPhrase(originalPhrase);
        setCorrectPhrases([originalPhrase]);
    }

    function shuffle() {
        setOriginalPhrase(originalPhrase.trim());
        const words = originalPhrase.trim().split(' ');
        const shuffledCombination = combinator.generate(words.length);
        const shuffledWords = [];
        for (let i = 0; i < shuffledCombination.length; i++) {
            shuffledWords.push(words[shuffledCombination[i]]);
        }
        setShuffledPhrase(shuffledWords.join(' '));
    }
}

const RowContainer = styled('div')({ display: 'flex' });
const WordContainer = styled(Typography)({
    padding: '4px',
    margin: '4px',
    cursor: 'pointer',
});

export { PhraseMelangeeEdition };
