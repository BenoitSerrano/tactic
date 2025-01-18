import { acceptableAnswerType } from '../../../../../types';
import { computeDisplayedTitle } from './lib/computeDisplayedTitle';
import { BlankTextField } from './components/BlankTextField';
import { PlainText } from './components/PlainText';
import { Typography, styled } from '@mui/material';
import { Caption } from '../../../components/Caption';
import { computeShouldDisplaySpaceBeforeCharacter } from './lib/shouldDisplaySpaceBeforeCharacter';
import { textSplitter } from '../../../../../lib/textSplitter';

function TexteATrousPreviewing(props: {
    index: number;
    points: string;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const blankCount = textSplitter.countBlanks(props.title);
    const pointsPerBlank = Number(props.points) / blankCount;
    const displayedTitle = computeDisplayedTitle(props.title, props.acceptableAnswers);
    return (
        <MainContainer>
            <TitleContainer>
                <IndexContainer>{props.index}.</IndexContainer>
                {displayedTitle.map((chunk, index) => {
                    switch (chunk.kind) {
                        case 'text':
                            const shouldDisplaySpaceBeforeCharacter =
                                computeShouldDisplaySpaceBeforeCharacter(chunk.word);
                            return (
                                <PlainText
                                    shouldDisplaySpaceBeforeCharacter={
                                        shouldDisplaySpaceBeforeCharacter
                                    }
                                    key={`chunk-text-${index}`}
                                >
                                    {chunk.word}
                                </PlainText>
                            );
                        case 'rightAnswerText':
                            return (
                                <BlankTextField
                                    key={`chunk-rightAnswerText-${index}`}
                                    variant="standard"
                                    disabled
                                    value="...."
                                />
                            );
                        default:
                            return undefined;
                    }
                })}
            </TitleContainer>

            <RightAnswerContainer>
                <CaptionContainer>
                    <Caption>Réponse correcte</Caption> :
                </CaptionContainer>
                {displayedTitle.map((chunk, chunkIndex) => {
                    const key = `question-${props.index}-chunk-${chunkIndex}`;
                    switch (chunk.kind) {
                        case 'text':
                            const shouldDisplaySpaceBeforeCharacter =
                                computeShouldDisplaySpaceBeforeCharacter(chunk.word);

                            return (
                                <PlainText
                                    shouldDisplaySpaceBeforeCharacter={
                                        shouldDisplaySpaceBeforeCharacter
                                    }
                                    key={key}
                                >
                                    {chunk.word}
                                </PlainText>
                            );
                        case 'rightAnswerText':
                            return (
                                <RightAnswerText key={key}>{chunk.words.join(' ')}</RightAnswerText>
                            );
                        default:
                            return undefined;
                    }
                })}
            </RightAnswerContainer>
            <PointsPerBlankContainer>
                <CaptionContainer>
                    <Caption>Nombre de points par trou</Caption> :
                </CaptionContainer>
                {pointsPerBlank}
            </PointsPerBlankContainer>
        </MainContainer>
    );
}

const PointsPerBlankContainer = styled(Typography)({ display: 'flex' });

const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const RightAnswerText = styled('span')(({ theme }) => ({
    color: theme.palette.success.main,
    marginLeft: '4px',
    fontWeight: 'bold',
}));

const RightAnswerContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
}));

const CaptionContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const IndexContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));
const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
}));
export { TexteATrousPreviewing };
