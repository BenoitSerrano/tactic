import { Typography, styled } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IsolatedWord, IsolatedWordContainer } from './IsolatedWord';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { shuffledAnswerStateType } from '../lib/computeShuffledAnswerState';
import { IconButton } from '../../../components/IconButton';

function WordsShuffler(props: {
    initialWords: string[];
    shuffledAnswerState: shuffledAnswerStateType;
    placeWord: (wordIndex: number) => void;
    reset: () => void;
}) {
    const { alreadyPlacedWords, remainingWordIndexesToPlace } = props.shuffledAnswerState;
    const totalWordsCount = props.initialWords.length;
    return (
        <Container>
            <Row>
                {remainingWordIndexesToPlace.map((wordIndexToPlace) => {
                    const wordToPlace = props.initialWords[wordIndexToPlace];
                    return (
                        <IsolatedWordContainer>
                            <IsolatedWord
                                onClick={() => props.placeWord(wordIndexToPlace)}
                                word={wordToPlace}
                            />
                        </IsolatedWordContainer>
                    );
                })}
            </Row>
            <Row>
                <SubdirectoryArrowRightIcon />
                <Typography>
                    {alreadyPlacedWords.join(' ')}
                    {' ___'.repeat(totalWordsCount - alreadyPlacedWords.length)}
                </Typography>
                <IconButton
                    disabled={alreadyPlacedWords.length === 0}
                    IconComponent={RefreshIcon}
                    onClick={props.reset}
                    title="Réinitialiser"
                />
            </Row>
        </Container>
    );
}

const Container = styled('div')({
    display: 'flex',
    flexDirection: 'column',
});

const Row = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
});

export { WordsShuffler };
