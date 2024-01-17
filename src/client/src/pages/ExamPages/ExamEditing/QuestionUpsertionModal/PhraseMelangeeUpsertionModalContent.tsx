import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, TextField, Typography, styled } from '@mui/material';
import { acceptableAnswerType } from '../../../../types';
import { textSplitter } from '../../../../lib/textSplitter';
import { QuestionInputContainer } from './QuestionInputContainer';
import { Button } from '../../../../components/Button';
import { combinator } from '../../../../lib/combinator';
import { WordsShuffler } from '../../components/WordsShuffler';
import { computeShuffledAnswerState } from '../../lib/computeShuffledAnswerState';

function PhraseMelangeeUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const initialAcceptableAnswers = props.acceptableAnswers.length
        ? props.acceptableAnswers[0][0].answer
        : '';
    const [newRightAnswerCombination, setNewRightAnswerCombination] = useState<
        number[] | undefined
    >();
    const [originalPhrase, setOriginalPhrase] = useState(initialAcceptableAnswers);
    const words = textSplitter.split(originalPhrase);

    const isResetCombinationDisabled = newRightAnswerCombination?.length === 0;

    return (
        <>
            <QuestionInputContainer title="Phrase originale">
                <TextField
                    autoFocus
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
                            <Typography>
                                <strong>{props.title}</strong>
                            </Typography>
                            <Button onClick={shufflePhrase}>Mélanger</Button>
                        </RowContainer>
                    </QuestionInputContainer>
                    <QuestionInputContainer
                        title="Phrases correctes"
                        subtitle={`Cliquez sur le bouton "Ajouter" pour ajouter des phrases correctes`}
                    >
                        <table>
                            {props.acceptableAnswers[0].map(({ answer }, index) => (
                                <tr key={answer}>
                                    <td>
                                        <Typography>{answer}</Typography>
                                    </td>
                                    <td>
                                        <IconButton
                                            color="error"
                                            onClick={buildDeleteRightAnswer(index)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                            {newRightAnswerCombination === undefined && (
                                <tr>
                                    <td>
                                        <Button onClick={resetNewRightAnswer}>Ajouter</Button>
                                    </td>
                                    <td />
                                </tr>
                            )}
                            <tr></tr>
                            {newRightAnswerCombination !== undefined && (
                                <tr>
                                    <td>
                                        <WordsShuffler
                                            initialWords={words}
                                            placeWord={buildPlaceWord()}
                                            shuffledAnswerState={computeShuffledAnswerState(
                                                words,
                                                newRightAnswerCombination,
                                            )}
                                            reset={resetNewRightAnswer}
                                        />
                                    </td>
                                    <td>
                                        <IconButton color="error" onClick={deleteNewRightAnswer}>
                                            <DeleteIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={isResetCombinationDisabled}
                                            color="warning"
                                            onClick={resetNewRightAnswer}
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    </td>
                                </tr>
                            )}
                        </table>
                    </QuestionInputContainer>
                </MainContainer>
            )}
            <QuestionInputContainer isLastItem title="Nombre de points attribués à la question">
                <TextField
                    value={props.points}
                    onChange={(event) => props.setPoints(event.target.value)}
                    label="Point(s)"
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
        setOriginalPhrase(originalPhrase.trim());
        const shuffledPhrase = computeShuffledPhrase(originalPhrase);
        props.setTitle(shuffledPhrase);
    }

    function computeShuffledPhrase(originalPhrase: string) {
        const words = textSplitter.split(originalPhrase.trim());
        const shuffledCombination = combinator.generate(words.length);
        const IsolatedWords = [];
        for (let i = 0; i < shuffledCombination.length; i++) {
            IsolatedWords.push(words[shuffledCombination[i]]);
        }
        return IsolatedWords.join(' ');
    }

    function buildDeleteRightAnswer(index: number) {
        return () => {
            const newAcceptableAnswerWithPoints = [...props.acceptableAnswers];
            newAcceptableAnswerWithPoints.splice(index, 1);
            props.setAcceptableAnswers(newAcceptableAnswerWithPoints);
        };
    }

    function onChangeOriginalPhrase(event: React.ChangeEvent<HTMLInputElement>) {
        const newOriginalPhrase = event.target.value;
        setOriginalPhrase(newOriginalPhrase);
        const shuffledPhrase = computeShuffledPhrase(newOriginalPhrase);

        props.setTitle(shuffledPhrase);
        props.setAcceptableAnswers([[{ grade: 'A', answer: newOriginalPhrase.trim() }]]);
    }
}

const MainContainer = styled('div')({ width: '100%' });

const RowContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
});

export { PhraseMelangeeUpsertionModalContent };
