import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from '../../components/Modal';
import { Button, TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { combinator } from '../../lib/combinator';

type phraseMelangeeType = {
    id: number;
    correctPhrases: string[];
    shuffledPhrase: string;
    words: string[];
    points: number;
};

type phraseMelangeeModalStatusType =
    | { kind: 'editing'; phraseMelangee: phraseMelangeeType }
    | { kind: 'creating' };

function PhraseMelangeeUpsertionModal(props: {
    close: () => void;
    modalStatus: phraseMelangeeModalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const [originalPhrase, setOriginalPhrase] = useState<string>(
        (props.modalStatus.kind === 'editing' &&
            props.modalStatus.phraseMelangee.correctPhrases[0]) ||
            '',
    );

    const [shuffledPhrase, setShuffledPhrase] = useState<string>(
        (props.modalStatus.kind === 'editing' && props.modalStatus.phraseMelangee.shuffledPhrase) ||
            '',
    );

    const [correctPhrases, setCorrectPhrases] = useState<string[]>(
        (props.modalStatus.kind === 'editing' && props.modalStatus.phraseMelangee.correctPhrases) ||
            [],
    );

    const [correctCombination, setCorrectCombination] = useState<number[]>([]);

    const updatePhraseMelangeeMutation = useMutation({
        mutationFn: api.updatePhraseMelangee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createPhraseMelangeeMutation = useMutation({
        mutationFn: api.createPhraseMelangee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const words = originalPhrase.trim().split(' ');

    const isUpdating = updatePhraseMelangeeMutation.isLoading;
    const isCreating = createPhraseMelangeeMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={savePhraseMelangee}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
        >
            <TextField
                fullWidth
                label="Phrase originale"
                placeholder="..."
                value={originalPhrase}
                onChange={onChangeOriginalPhrase}
            />
            {!!originalPhrase && (
                <>
                    <RowContainer>
                        <Typography>Phrase mélangée : {shuffledPhrase}</Typography>
                        <Button onClick={shufflePhrase}>Mélanger</Button>
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
        </Modal>
    );

    function computeConfirmButtonLabel(modalStatus: phraseMelangeeModalStatusType) {
        switch (modalStatus.kind) {
            case 'creating':
                return 'Créer';
            case 'editing':
                return 'Modifier';
        }
    }
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
        setShuffledPhrase(shuffledWords.join(' '));
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const originalPhrase = event.target.value;
        setOriginalPhrase(originalPhrase);
        setShuffledPhrase(originalPhrase);
        setCorrectPhrases([originalPhrase]);
    }

    function validateCorrectPhrase() {
        const newCorrectPhrase = correctCombination.map((index) => words[index]).join(' ');
        setCorrectPhrases([...correctPhrases, newCorrectPhrase]);
        setCorrectCombination([]);
    }

    function savePhraseMelangee() {
        if (props.modalStatus?.kind === 'editing') {
            updatePhraseMelangeeMutation.mutate({
                examId: props.examId,
                phraseMelangeeId: props.modalStatus.phraseMelangee.id,
                correctPhrases,
                shuffledPhrase,
                words,
            });
        } else {
            createPhraseMelangeeMutation.mutate({
                examId: props.examId,
                correctPhrases,
                shuffledPhrase,
                words,
            });
        }
    }
}

const RowContainer = styled('div')({ display: 'flex' });
const WordContainer = styled(Typography)({
    padding: '4px',
    margin: '4px',
    cursor: 'pointer',
});
export { PhraseMelangeeUpsertionModal };

export type { phraseMelangeeType, phraseMelangeeModalStatusType };
