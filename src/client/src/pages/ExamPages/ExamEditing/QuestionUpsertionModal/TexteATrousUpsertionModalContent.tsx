import { TextField, styled } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import { QuestionInputContainer } from './QuestionInputContainer';
import { acceptableAnswerType } from '../../../../types';
import { WordsBlanker } from '../components/WordsBlanker';
import { PointsPerBlankHandler } from '../components/PointsPerBlankHandler';
import { converter } from '../../lib/converter';
import { Button } from '../../../../components/Button';
import { sanitizer } from '../lib/sanitizer';

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
    const displayedTitle = converter.convertBlankedTitleToFullTitle(
        props.title,
        props.acceptableAnswers,
    );
    return (
        <>
            <QuestionInputContainer title="Texte complet">
                <OriginalTextContainer>
                    <TextField
                        multiline
                        autoFocus
                        disabled={isWholeSentenceFrozen}
                        fullWidth
                        label="Texte complet"
                        value={displayedTitle}
                        onChange={setTitle}
                    />
                    <OriginalTextButtonContainer>
                        {isWholeSentenceFrozen && (
                            <Button
                                color="inherit"
                                startIcon={<EditIcon />}
                                onClick={unfreezeSentence}
                                type="submit"
                            >
                                Éditer
                            </Button>
                        )}
                    </OriginalTextButtonContainer>
                </OriginalTextContainer>
            </QuestionInputContainer>
            <QuestionInputContainer
                title="Texte à trous"
                subtitle={`Cliquez sur les mots à cacher dans le texte ci-dessous. En cas d'erreur, cliquez sur "....".`}
            >
                <WordsBlanker
                    title={props.title.trim()}
                    setTitle={onSetTitleInWordsBlanker}
                    acceptableAnswers={props.acceptableAnswers}
                    setAcceptableAnswers={onSetAcceptableAnswersInWordsBlanker}
                    pointsPerBlank={Number(pointsPerBlank)}
                    setPoints={(points) => props.setPoints(`${points}`)}
                />
            </QuestionInputContainer>
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

    function setTitle(event: React.ChangeEvent<HTMLInputElement>) {
        const title = event.target.value;
        const sanitizedTitle = sanitizer.sanitize(title);
        props.setTitle(sanitizedTitle);
    }

    function freezeSentence() {
        if (!isWholeSentenceFrozen) {
            setIsWholeSentenceFrozen(true);
        }
    }

    function onSetTitleInWordsBlanker(title: string) {
        freezeSentence();
        props.setTitle(title);
    }

    function onSetAcceptableAnswersInWordsBlanker(acceptableAnswers: acceptableAnswerType[][]) {
        freezeSentence();
        props.setAcceptableAnswers(acceptableAnswers);
    }

    function unfreezeSentence() {
        props.setTitle(displayedTitle);
        props.setAcceptableAnswers([]);
        setIsWholeSentenceFrozen(false);
    }
}

const OriginalTextContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
}));

const OriginalTextButtonContainer = styled('div')(({ theme }) => ({
    marginLeft: theme.spacing(2),
}));

export { TexteATrousUpsertionModalContent };
