import { useState } from 'react';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { IconButton, TextField, Typography, styled } from '@mui/material';
import { combinator } from '../../lib/combinator';
import { Button } from '../../components/Button';
import { textSplitter } from '../../lib/textSplitter';
import { acceptableAnswerType } from '../../types';
import { QuestionInputContainer } from './QuestionInputContainer';

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
    const [newRightAnswer, setNewRightAnswer] = useState<string[] | undefined>(undefined);
    const [originalPhrase, setOriginalPhrase] = useState(initialAcceptableAnswers);
    const [displayedWordsToPlace, setDisplayedWordsToPlace] = useState(
        textSplitter.split(initialAcceptableAnswers),
    );
    const words = textSplitter.split(originalPhrase);

    const isResetCombinationDisabled = newRightAnswer?.length === 0;

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
                            {newRightAnswer === undefined && (
                                <tr>
                                    <td>
                                        <Button onClick={resetNewRightAnswer}>Ajouter</Button>
                                    </td>
                                    <td />
                                </tr>
                            )}
                            <tr></tr>
                            {newRightAnswer !== undefined && (
                                <tr>
                                    <td>
                                        <CorrectPhraseCreationContainer>
                                            <WordLinesContainer>
                                                <WordLineContainer>
                                                    {displayedWordsToPlace.map((word, index) => (
                                                        <WordContainer
                                                            key={index + word}
                                                            onClick={buildOnClickOnWordToPlace(
                                                                index,
                                                            )}
                                                        >
                                                            <Typography>{word}</Typography>
                                                        </WordContainer>
                                                    ))}
                                                </WordLineContainer>
                                                <WordLineContainer>
                                                    <SubdirectoryArrowRightIcon />
                                                    <Typography>
                                                        {newRightAnswer.join(' ')}
                                                        {' ___'.repeat(
                                                            words.length - newRightAnswer.length,
                                                        )}
                                                    </Typography>
                                                </WordLineContainer>
                                            </WordLinesContainer>
                                        </CorrectPhraseCreationContainer>
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

    function buildOnClickOnWordToPlace(index: number) {
        return () => {
            if (!newRightAnswer) {
                return;
            }
            const updatedNewRightAnswer = [...newRightAnswer, displayedWordsToPlace[index]];

            if (newRightAnswer.length + 1 === words.length) {
                props.setAcceptableAnswers([
                    [
                        ...props.acceptableAnswers[0],
                        { grade: 'A', answer: updatedNewRightAnswer.join(' ') },
                    ],
                ]);
                setNewRightAnswer(undefined);
                setDisplayedWordsToPlace(textSplitter.split(originalPhrase));
            } else {
                setNewRightAnswer(updatedNewRightAnswer);
                const newDisplayedWordsToPlace = [...displayedWordsToPlace];
                newDisplayedWordsToPlace.splice(index, 1);

                setDisplayedWordsToPlace(newDisplayedWordsToPlace);
            }
        };
    }

    function resetNewRightAnswer() {
        setNewRightAnswer([]);
        setDisplayedWordsToPlace(textSplitter.split(originalPhrase));
    }

    function deleteNewRightAnswer() {
        setNewRightAnswer(undefined);
        setDisplayedWordsToPlace(textSplitter.split(originalPhrase));
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

const CorrectPhraseCreationContainer = styled('div')({
    display: 'flex',
});

const WordLineContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
});
const WordLinesContainer = styled('div')({
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
});
const WordContainer = styled('span')({
    borderWidth: '1px',
    borderStyle: 'dotted',
    padding: '4px',
    marginLeft: '4px',
    marginRight: '4px',
    cursor: 'pointer',
});
export { PhraseMelangeeUpsertionModalContent };
