import { IconButton, TextField, styled } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import { FormEvent, useState } from 'react';
import { QuestionInputContainer } from './QuestionInputContainer';
import { acceptableAnswerType } from '../../../../types';
import { WordsBlanker } from '../components/WordsBlanker';
import { PointsPerBlankHandler } from '../components/PointsPerBlankHandler';
import { converter } from '../../lib/converter';

function TexteATrousUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (newAcceptableAnswerWithPoints: acceptableAnswerType[][]) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const initialPointsPerBlank = props.acceptableAnswers.length
        ? Number(props.points) / props.acceptableAnswers.length
        : Number(props.points);
    const [pointsPerBlank, setPointsPerBlank] = useState(`${initialPointsPerBlank}`);
    const [isWholeSentenceFrozen, setIsWholeSentenceFrozen] = useState(!!props.title);
    const blankCount = converter.computeBlankCount(props.title);
    return (
        <>
            <QuestionInputContainer title="Texte complet">
                <OriginalTextContainer onSubmit={handleSubmitOriginalText}>
                    <TextField
                        autoFocus
                        disabled={isWholeSentenceFrozen}
                        fullWidth
                        label="Texte complet"
                        value={props.title}
                        onChange={(event) => props.setTitle(event.target.value)}
                    />
                    {isWholeSentenceFrozen ? (
                        <IconButton onClick={resetWholeSentence} color="warning">
                            <RefreshIcon />
                        </IconButton>
                    ) : (
                        <IconButton type="submit" color="success" disabled={!props.title}>
                            <CheckIcon />
                        </IconButton>
                    )}
                </OriginalTextContainer>
            </QuestionInputContainer>
            {isWholeSentenceFrozen && (
                <QuestionInputContainer
                    title="Texte à trous"
                    subtitle="Cliquez sur les mots à cacher dans le texte ci-dessous :"
                >
                    <WordsBlanker
                        title={props.title}
                        setTitle={props.setTitle}
                        acceptableAnswers={props.acceptableAnswers}
                        setAcceptableAnswers={props.setAcceptableAnswers}
                        pointsPerBlank={Number(pointsPerBlank)}
                        setPoints={(points) => props.setPoints(`${points}`)}
                    />
                </QuestionInputContainer>
            )}
            <QuestionInputContainer isLastItem title="Points">
                <PointsPerBlankHandler
                    blankCount={blankCount}
                    mode="editing"
                    pointsPerBlank={pointsPerBlank}
                    setPoints={props.setPoints}
                    setPointsPerBlank={setPointsPerBlank}
                />
            </QuestionInputContainer>
        </>
    );

    function handleSubmitOriginalText(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        freezeSentence();
    }

    function freezeSentence() {
        props.setTitle(props.title.trim());
        setIsWholeSentenceFrozen(true);
    }

    function resetWholeSentence() {
        setIsWholeSentenceFrozen(false);
        props.setTitle('');
        props.setAcceptableAnswers([]);
        props.setPoints('0');
    }
}

const OriginalTextContainer = styled('form')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

export { TexteATrousUpsertionModalContent };
