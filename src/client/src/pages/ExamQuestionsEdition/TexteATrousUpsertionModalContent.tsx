import { IconButton, TextField, Typography, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';

import { useState } from 'react';
import { computeTexteATrousState } from './lib/computeTexteATrousState';
import { textSplitter } from '../../lib/textSplitter';

function TexteATrousUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (newRightAnswers: string[]) => void;
}) {
    const [isWholeSentenceFrozen, setIsWholeSentenceFrozen] = useState(false);
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
        </>
    );

    function resetWholeSentence() {
        setIsWholeSentenceFrozen(false);
        props.setTitle('');
        props.setRightAnswers([]);
    }

    function buildOnClickOnWord(wordIndex: number) {
        return () => {
            const { nextRightAnswers, nextTitle } = computeTexteATrousState(wordIndex, {
                prevTitle: props.title,
                prevRightAnswers: props.rightAnswers,
            });
            props.setTitle(nextTitle);
            props.setRightAnswers(nextRightAnswers);
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
