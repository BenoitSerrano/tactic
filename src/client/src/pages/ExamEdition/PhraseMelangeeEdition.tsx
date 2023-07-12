import { useMutation } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import { api } from '../../lib/api';
import { combinator } from '../../lib/combinator';
import { phraseMelangeeModule } from '../../modules/phraseMelangee';

function PhraseMelangeeEdition(props: {
    examId: string;
    phraseMelangee: {
        id: number;
        shuffledCombination: number[];
        words: string[];
        order: number;
    };
}) {
    const [rightPhrase, setRightPhrase] = useState(props.phraseMelangee.words.join(' '));
    const [shuffledCombination, setShuffledCombination] = useState<number[]>(
        props.phraseMelangee.shuffledCombination,
    );

    const updatePhraseMelangeeMutation = useMutation({
        mutationFn: api.updatePhraseMelangee,
    });

    const shuffledWords = phraseMelangeeModule.computeShuffledWords(
        rightPhrase.trim().split(' '),
        shuffledCombination,
    );

    return (
        <div>
            <p>{props.phraseMelangee.order + 1}.</p>
            <TextField
                fullWidth
                label="Phrase originale"
                placeholder="..."
                value={rightPhrase}
                onChange={onChangeRightPhrase}
            />
            <Typography>
                <strong>Phrase à reconstituer : {shuffledWords.join(' ')}</strong>
            </Typography>
            <Button onClick={shuffleAndSave}>Mélanger et sauvegarder</Button>
        </div>
    );

    function onChangeRightPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const rightPhrase = event.target.value;
        setRightPhrase(rightPhrase);
    }

    function shuffleAndSave() {
        const wordsCount = rightPhrase.trim().split(' ').length;
        const shuffledCombination = combinator.generate(wordsCount);

        setShuffledCombination(shuffledCombination);
        updatePhraseMelangeeMutation.mutate({
            examId: props.examId,
            phraseMelangeeId: props.phraseMelangee.id,
            shuffledCombination,
            words: rightPhrase.trim().split(' '),
        });
    }
}

export { PhraseMelangeeEdition };
