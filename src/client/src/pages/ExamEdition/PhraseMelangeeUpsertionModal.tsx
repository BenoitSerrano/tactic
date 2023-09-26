import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { Modal } from '../../components/Modal';
import { Button, TextField, Typography, styled } from '@mui/material';
import { api } from '../../lib/api';
import { combinator } from '../../lib/combinator';
import { computeConfirmButtonLabel, computeModalTitlePrefix, modalStatusType } from './utils';
import { useAlert } from '../../lib/alert';

type phraseMelangeeType = {
    id: number;
    correctPhrases: string[];
    shuffledPhrase: string;
    words: string[];
    points: number;
};

type phraseMelangeeModalStatusType = modalStatusType<phraseMelangeeType>;

function PhraseMelangeeUpsertionModal(props: {
    close: () => void;
    modalStatus: phraseMelangeeModalStatusType;
    examId: string;
}) {
    const queryClient = useQueryClient();
    const { displayAlert } = useAlert();

    const [originalPhrase, setOriginalPhrase] = useState<string>(
        (props.modalStatus.kind === 'editing' && props.modalStatus.question.correctPhrases[0]) ||
            '',
    );

    const [shuffledPhrase, setShuffledPhrase] = useState<string>(
        (props.modalStatus.kind === 'editing' && props.modalStatus.question.shuffledPhrase) || '',
    );

    const [correctPhrases, setCorrectPhrases] = useState<string[]>(
        (props.modalStatus.kind === 'editing' && props.modalStatus.question.correctPhrases) || [],
    );

    const [correctCombination, setCorrectCombination] = useState<number[]>([]);

    const [points, setPoints] = useState(
        props.modalStatus.kind === 'editing' ? `${props.modalStatus.question.points}` : '3.0',
    );

    const updatePhraseMelangeeMutation = useMutation({
        mutationFn: api.updatePhraseMelangee,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été modifiée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const createPhraseMelangeeMutation = useMutation({
        mutationFn: api.createPhraseMelangee,
        onSuccess: () => {
            props.close();
            displayAlert({ text: 'La question a bien été créée.', variant: 'success' });
            queryClient.invalidateQueries({ queryKey: ['exams', props.examId] });
        },
    });

    const words = originalPhrase.trim().split(' ');

    const isUpdating = updatePhraseMelangeeMutation.isLoading;
    const isCreating = createPhraseMelangeeMutation.isLoading;

    const confirmButtonLabel = computeConfirmButtonLabel(props.modalStatus);
    const titlePrefix = computeModalTitlePrefix(props.modalStatus);
    const isAddCombinationDisabled =
        correctCombination.length !== words.length ||
        correctPhrases.includes(correctCombination.map((index) => words[index]).join(' '));

    return (
        <Modal
            isOpen={!!props.modalStatus}
            close={props.close}
            onConfirm={savePhraseMelangee}
            confirmButtonLabel={confirmButtonLabel}
            cancelButtonLabel="Annuler"
            isConfirmLoading={isUpdating || isCreating}
            title={`${titlePrefix} d'une phrase à ordonner`}
        >
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
                            Phrase mélangée : <strong>{shuffledPhrase}</strong>
                        </Typography>
                        <Button onClick={shufflePhrase}>Mélanger</Button>
                    </RowContainer>
                    <>
                        <Typography>Phrases correctes :</Typography>
                        <ul>
                            {correctPhrases.map((correctPhrase) => (
                                <li key={correctPhrase}>
                                    <Typography>{correctPhrase}</Typography>
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
            <PointsContainer>
                <TextField
                    value={points}
                    onChange={onChangePoint}
                    label="Point(s) pour la question"
                />
            </PointsContainer>
        </Modal>
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
        setShuffledPhrase(shuffledWords.join(' '));
    }

    function onChangePoint(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(/^[0-9]+(\.)?([0-9]+)?$/)) {
            setPoints(value);
        }
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
                phraseMelangeeId: props.modalStatus.question.id,
                correctPhrases,
                shuffledPhrase,
                words,
                points: Number(points),
            });
        } else {
            createPhraseMelangeeMutation.mutate({
                examId: props.examId,
                correctPhrases,
                shuffledPhrase,
                words,
                points: Number(points),
            });
        }
    }
}

const MainContainer = styled('div')({ width: '100%' });

const RowContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
});

const PointsContainer = styled('div')({
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
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
export { PhraseMelangeeUpsertionModal };

export type { phraseMelangeeType, phraseMelangeeModalStatusType };
