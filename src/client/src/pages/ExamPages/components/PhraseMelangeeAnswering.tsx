import { useState } from 'react';
import { IconButton, Tooltip, Typography, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { questionWithoutAnswerType } from '../types';
import { textSplitter } from '../../../lib/textSplitter';
import { ShuffleWord } from './ShuffledWord';

function PhraseMelangeeAnswering(props: {
    question: questionWithoutAnswerType;
    index: number;
    currentAnswer: string;
    setCurrentAnswer: (newAnswer: string) => void;
}) {
    const [pendingAnswer, setPendingAnswer] = useState<string[]>(
        props.currentAnswer ? textSplitter.split(props.currentAnswer) : [],
    );
    const shuffledWords = textSplitter.split(props.question.title);

    let displayedShuffleWords = [...shuffledWords];
    for (const word of pendingAnswer) {
        const wordIndex = displayedShuffleWords.indexOf(word);
        displayedShuffleWords.splice(wordIndex, 1);
    }

    const isResetButtonDisabled = pendingAnswer.length === 0;

    return (
        <div>
            <StyledContainer>
                <Typography>
                    <BoldContainer>{props.index}. </BoldContainer>
                </Typography>
                {displayedShuffleWords.map((word, index) => (
                    <ShuffledWordContainer key={index}>
                        <ShuffleWord word={word} onClick={buildOnClickOnShuffledWord(index)} />
                    </ShuffledWordContainer>
                ))}
            </StyledContainer>

            <CurrentAnswerContainer>
                <Typography>
                    <BoldContainer>Votre réponse :</BoldContainer>{' '}
                    <span>
                        {pendingAnswer.join(' ')}
                        {' ____'.repeat(shuffledWords.length - pendingAnswer.length)}
                    </span>
                </Typography>
                <Tooltip title="Réinitialiser">
                    <IconButton
                        disabled={isResetButtonDisabled}
                        onClick={() => setPendingAnswer([])}
                        color="inherit"
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </CurrentAnswerContainer>
        </div>
    );

    function buildOnClickOnShuffledWord(index: number) {
        return () => {
            const newPendingAnswer = [...pendingAnswer, displayedShuffleWords[index]];
            setPendingAnswer(newPendingAnswer);

            if (newPendingAnswer.length === shuffledWords.length) {
                const answer = newPendingAnswer.join(' ');
                props.setCurrentAnswer(answer);
            }
        };
    }
}

const CurrentAnswerContainer = styled('div')({ display: 'flex', alignItems: 'center' });

const StyledContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: '10px',
    marginBottom: '10px',
});

const ShuffledWordContainer = styled('div')({
    marginLeft: '4px',
    marginRight: '4px',
});

const BoldContainer = styled('span')({ fontWeight: 'bold' });

export { PhraseMelangeeAnswering };
