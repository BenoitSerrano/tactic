import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, TextField, Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { textSplitter } from '../../../../lib/textSplitter';
import { QuestionInputContainer } from './QuestionInputContainer';
import { Button } from '../../../../components/Button';
import { combinator } from '../../../../lib/combinator';
import { WordsShuffler } from '../../components/WordsShuffler';
import { computeShuffledAnswerState } from '../../lib/computeShuffledAnswerState';
import { punctuationSpacesHandler } from '../lib/punctationSpacesHandler';
import { PointsTextField } from '../components/PointsTextField';

function PhraseMelangeeUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
    points: string;
    setPoints: (points: string) => void;
    canEditPoints: boolean;
}) {
    const initialAcceptableAnswers = props.acceptableAnswers.length
        ? props.acceptableAnswers[0][0].answer
        : '';
    const [newRightAnswerCombination, setNewRightAnswerCombination] = useState<
        number[] | undefined
    >();
    const [originalPhrase, setOriginalPhrase] = useState(initialAcceptableAnswers);
    const words = textSplitter.split(originalPhrase);
    const isDeleteButtonDisabled =
        !props.acceptableAnswers.length || props.acceptableAnswers[0].length <= 1;

    return (
        <>
            <QuestionInputContainer title="Phrase originale">
                <TextField
                    autoFocus
                    multiline
                    fullWidth
                    label="Phrase originale"
                    placeholder="..."
                    value={originalPhrase}
                    onChange={onChangeOriginalPhrase}
                />
            </QuestionInputContainer>
            {!!originalPhrase && (
                <MainContainer>
                    <QuestionInputContainer
                        title="Phrase mélangée"
                        subtitle={`Cliquez sur le bouton "Mélanger" pour changer l'ordre des mots à afficher à l'élève`}
                    >
                        <RowContainer>
                            <Title>
                                <strong>{props.title}</strong>
                            </Title>
                            <Button variant="outlined" onClick={shufflePhrase}>
                                Mélanger
                            </Button>
                        </RowContainer>
                    </QuestionInputContainer>
                    <QuestionInputContainer
                        title="Phrases correctes"
                        subtitle={`Cliquez sur le bouton "Ajouter" pour ajouter des phrases correctes`}
                    >
                        {props.acceptableAnswers[0].map(({ answer }, index) => (
                            <RowContainer key={`answer-${answer}`}>
                                <IconButton
                                    color="error"
                                    onClick={buildDeleteRightAnswer(index)}
                                    disabled={isDeleteButtonDisabled}
                                >
                                    <DeleteIcon />
                                </IconButton>
                                <Typography>{answer}</Typography>
                            </RowContainer>
                        ))}
                        {newRightAnswerCombination === undefined && (
                            <Button onClick={resetNewRightAnswer}>Ajouter</Button>
                        )}
                        {newRightAnswerCombination !== undefined && (
                            <RowContainer>
                                <IconButton color="error" onClick={deleteNewRightAnswer}>
                                    <DeleteIcon />
                                </IconButton>
                                <WordsShuffler
                                    initialWords={words}
                                    placeWord={buildPlaceWord()}
                                    shuffledAnswerState={computeShuffledAnswerState(
                                        words,
                                        newRightAnswerCombination,
                                    )}
                                    reset={resetNewRightAnswer}
                                />
                            </RowContainer>
                        )}
                    </QuestionInputContainer>
                </MainContainer>
            )}
            <QuestionInputContainer isLastItem title="Nombre de points attribués à la question">
                <PointsTextField
                    canEdit={props.canEditPoints}
                    points={props.points}
                    setPoints={props.setPoints}
                />
            </QuestionInputContainer>
        </>
    );

    function buildPlaceWord() {
        return (wordIndexToPlace: number) => {
            if (!newRightAnswerCombination) {
                return;
            }
            const updatedNewRightAnswerCombination = [
                ...newRightAnswerCombination,
                wordIndexToPlace,
            ];
            if (updatedNewRightAnswerCombination.length === words.length) {
                props.setAcceptableAnswers([
                    [
                        ...props.acceptableAnswers[0],
                        {
                            grade: 'A',
                            answer: updatedNewRightAnswerCombination
                                .map((wordIndex) => words[wordIndex])
                                .join(' '),
                        },
                    ],
                ]);
                setNewRightAnswerCombination(undefined);
            } else {
                setNewRightAnswerCombination(updatedNewRightAnswerCombination);
            }
        };
    }

    function resetNewRightAnswer() {
        setNewRightAnswerCombination([]);
    }

    function deleteNewRightAnswer() {
        setNewRightAnswerCombination(undefined);
    }

    function shufflePhrase() {
        const newOriginalPhrase = punctuationSpacesHandler.addSpaces(originalPhrase.trim());
        setOriginalPhrase(newOriginalPhrase);

        const shuffledPhrase = computeShuffledPhrase(newOriginalPhrase);
        props.setTitle(shuffledPhrase);
    }

    function computeShuffledPhrase(originalPhrase: string) {
        const words = textSplitter.split(originalPhrase.trim(), {
            shouldApostrophesBeBinding: true,
        });
        const shuffledCombination = combinator.generate(words.length);
        const isolatedWords = [];
        for (let i = 0; i < shuffledCombination.length; i++) {
            isolatedWords.push(words[shuffledCombination[i]]);
        }
        return isolatedWords.join(' ');
    }

    function buildDeleteRightAnswer(index: number) {
        return () => {
            const newAcceptableAnswerWithPoints = [...props.acceptableAnswers];
            newAcceptableAnswerWithPoints[0].splice(index, 1);
            props.setAcceptableAnswers(newAcceptableAnswerWithPoints);
        };
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        setOriginalPhrase(event.target.value);
        const newOriginalPhrase = punctuationSpacesHandler.addSpaces(event.target.value);
        props.setTitle(newOriginalPhrase);

        props.setAcceptableAnswers([[{ grade: 'A', answer: newOriginalPhrase }]]);
    }
}

const Title = styled(Typography)(({ theme }) => ({ marginRight: theme.spacing(2) }));

const MainContainer = styled('div')({ width: '100%' });

const RowContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export { PhraseMelangeeUpsertionModalContent };
