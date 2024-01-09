import { acceptableAnswerType } from '../../../../../types';
import { computeDisplayedTitle } from './lib/computeDisplayedTitle';
import { RightAnswerTextField } from './components/RightAnswerTextField';
import { MainContainer } from './components/MainContainer';
import { PlainText } from './components/PlainText';
import { Typography, styled } from '@mui/material';
import { AcceptableAnswerCaption } from '../components/AcceptableAnswerCaption';

function TexteATrousPreviewing(props: {
    index: number;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
}) {
    const displayedTitle = computeDisplayedTitle(props.title, props.acceptableAnswers);
    return (
        <MainContainer>
            <TitleContainer>
                <IndexContainer>{props.index}.</IndexContainer>
                {displayedTitle.map((chunk) => {
                    switch (chunk.kind) {
                        case 'text':
                            return <PlainText>{chunk.value}</PlainText>;
                        case 'rightAnswerText':
                            return (
                                <RightAnswerTextField variant="standard" disabled value="...." />
                            );
                        default:
                            return undefined;
                    }
                })}
            </TitleContainer>
            <RightAnswerContainer>
                <AcceptableAnswerCaptionContainer>
                    <AcceptableAnswerCaption>Réponse correcte</AcceptableAnswerCaption> :
                </AcceptableAnswerCaptionContainer>
                {displayedTitle.map((chunk, chunkIndex) => {
                    const key = `question-${props.index}-chunk-${chunkIndex}`;
                    switch (chunk.kind) {
                        case 'text':
                            return <PlainText key={key}>{chunk.value}</PlainText>;
                        case 'rightAnswerText':
                            return <RightAnswerText key={key}>{chunk.value}</RightAnswerText>;
                        default:
                            return undefined;
                    }
                })}
            </RightAnswerContainer>
        </MainContainer>
    );
}

const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const RightAnswerText = styled('span')(({ theme }) => ({
    color: theme.palette.success.main,
    marginRight: theme.spacing(1),
    fontWeight: 'bold',
}));

const RightAnswerContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    flex: 1,
    alignItems: 'baseline',
}));

const AcceptableAnswerCaptionContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const IndexContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

export { TexteATrousPreviewing };
