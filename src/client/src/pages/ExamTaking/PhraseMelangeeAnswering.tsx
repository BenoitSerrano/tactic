import React, { useState } from 'react';
import { Typography, styled } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

function PhraseMelangeeAnswering(props: {
    phraseMelangee: {
        id: number;
        shuffledPhrase: string;
        answer: string;
    };
    index: number;
    attemptId: string;
}) {
    const [combination, setCombination] = useState<number[]>([]);
    const queryClient = useQueryClient();

    const createOrUpdatePhraseMelangeeAnswerMutation = useMutation({
        mutationFn: api.createOrUpdatePhraseMelangeeAnswer,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['attempts-without-answers', props.attemptId],
            });
        },
    });

    const shuffledWords = props.phraseMelangee.shuffledPhrase.split(' ');

    return (
        <div>
            <StyledContainer>
                <Typography>{props.index + 1}. </Typography>
                {shuffledWords.map((word, index) =>
                    combination.includes(index) ? undefined : (
                        <ShuffledWordContainer
                            key={index}
                            onClick={buildOnClickOnShuffledWord(index)}
                        >
                            <Typography>{word}</Typography>
                        </ShuffledWordContainer>
                    ),
                )}
            </StyledContainer>
            <StyledContainer>
                {combination.map((combinationIndex, index) => (
                    <ShuffledWordContainer
                        key={index}
                        onClick={buildOnClickOnReconstitutedWord(index)}
                    >
                        <Typography>{shuffledWords[combinationIndex]}</Typography>
                    </ShuffledWordContainer>
                ))}
            </StyledContainer>
            {!!props.phraseMelangee.answer && (
                <Typography>Votre réponse : {props.phraseMelangee.answer}</Typography>
            )}
        </div>
    );

    function buildOnClickOnShuffledWord(index: number) {
        return () => {
            const newCombination = [...combination, index];
            setCombination(newCombination);

            if (newCombination.length === shuffledWords.length) {
                createOrUpdatePhraseMelangeeAnswerMutation.mutate({
                    attemptId: props.attemptId,
                    phraseMelangeeId: props.phraseMelangee.id,
                    answer: newCombination.map((index) => shuffledWords[index]).join(' '),
                });
            }
        };
    }

    function buildOnClickOnReconstitutedWord(index: number) {
        return () => {
            const newCombination = [...combination];
            newCombination.splice(index, 1);
            setCombination(newCombination);
        };
    }
}

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
});

const ShuffledWordContainer = styled('div')({
    borderWidth: '2px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    cursor: 'pointer',
});

export { PhraseMelangeeAnswering };
