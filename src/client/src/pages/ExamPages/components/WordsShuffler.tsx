import { Typography, styled } from '@mui/material';
import { ShuffledWord, ShuffledWordContainer } from './ShuffledWord';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { shuffledAnswerStateType } from '../lib/computeShuffledAnswerState';

function WordsShuffler(props: {
    initialWords: string[];
    shuffledAnswerState: shuffledAnswerStateType;
    placeWord: (wordIndex: number) => void;
}) {
    const { alreadyPlacedWords, remainingWordIndexesToPlace } = props.shuffledAnswerState;
    const totalWordsCount = props.initialWords.length;
    return (
        <Container>
            <Row>
                {remainingWordIndexesToPlace.map((wordIndexToPlace) => {
                    const wordToPlace = props.initialWords[wordIndexToPlace];
                    return (
                        <ShuffledWordContainer>
                            <ShuffledWord
                                onClick={() => props.placeWord(wordIndexToPlace)}
                                word={wordToPlace}
                            />
                        </ShuffledWordContainer>
                    );
                })}
            </Row>
            <Row>
                <Typography>
                    <SubdirectoryArrowRightIcon />
                    {alreadyPlacedWords.join(' ')}
                    {' ___'.repeat(totalWordsCount - alreadyPlacedWords.length)}
                </Typography>
            </Row>
        </Container>
    );
}

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });
const Row = styled('div')({ display: 'flex', alignItems: 'center' });

export { WordsShuffler };
