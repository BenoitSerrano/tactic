import { Typography, styled } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import {
    okGradeType,
    okGrades,
    rightGradeType,
    rightGrades,
    textComponentMapping,
} from './constants';
import {
    aggregateAcceptableAnswersByGrade,
    aggregatedAcceptableAnswerType,
} from '../lib/aggregateAcceptableAnswersByGrade';
import { acceptableAnswerType } from '../../../../types';
import { RemoveButton } from './components/Buttons';
import { Button } from '../../../../components/Button';
import { VeryLightHorizontalDivider } from '../../../../components/HorizontalDivider';
import { useState } from 'react';
import { gradeConverter } from '../../../../lib/gradeConverter';
import { GradeExplanationIcon } from './components/GradeExplanationIcon';
import { IsolatedWord, IsolatedWordContainer } from '../../components/IsolatedWord';
import { computeShuffledAnswerState } from '../../lib/computeShuffledAnswerState';
import { WordsShuffler } from '../../components/WordsShuffler';
import { FormHelperText } from '../../../../components/FormHelperText';
import { formErrorHandler } from '../lib/formErrorHandler';

const initialNewAcceptableCombinationsByGrade = { A: [], B: [], C: [], D: [] };

function PhraseMelangeeEditing(props: {
    index: number;
    formErrors: string[];
    shouldDisplayErrors: boolean;
    title: string;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
}) {
    const aggregatedAcceptableAnswers = aggregateAcceptableAnswersByGrade(props.acceptableAnswers);

    const areThereOkAnswers = okGrades.some(
        (okGrade) => aggregatedAcceptableAnswers[okGrade].length > 0,
    );
    const acceptableAnswerGradesToEdit = areThereOkAnswers
        ? [...rightGrades, ...okGrades]
        : [...rightGrades];

    const [newAcceptableCombinationsByGrade, setNewAcceptableCombinationsByGrade] = useState<
        Record<rightGradeType | okGradeType, number[][]>
    >(initialNewAcceptableCombinationsByGrade);

    const shuffledPhraseWords = props.title.split(' ');

    const wordCount = props.title.split(' ').length;
    return (
        <Container>
            <TitleContainer>
                <QuestionIndex>{props.index}. </QuestionIndex>
                {props.title.split(' ').map((word, index) => (
                    <IsolatedWordContainer key={`shuffled-word-${index}`}>
                        <IsolatedWord word={word} />
                    </IsolatedWordContainer>
                ))}
            </TitleContainer>
            <AcceptableAnswersContainer>
                {acceptableAnswerGradesToEdit.map((grade, gradeIndex) => {
                    return (
                        <>
                            {renderAnswersToEdit(grade, aggregatedAcceptableAnswers[grade])}
                            {gradeIndex < acceptableAnswerGradesToEdit.length - 1 && (
                                <VeryLightHorizontalDivider />
                            )}
                        </>
                    );
                })}
            </AcceptableAnswersContainer>
        </Container>
    );

    function renderAnswersToEdit(
        grade: rightGradeType | okGradeType,
        acceptableAnswers: aggregatedAcceptableAnswerType[],
    ) {
        const pluralAdjective = gradeConverter.convertGradeToAdjective(grade, { isPlural: true });
        const singularAdjective = gradeConverter.convertGradeToAdjective(grade, {
            isPlural: false,
        });
        const canRemoveAcceptableAnswer = computeCanRemoveAcceptableAnswer(grade);
        const TextComponent = textComponentMapping[grade];
        const newAcceptableCombinations = newAcceptableCombinationsByGrade[grade];

        return (
            <GradeAcceptableAnswersContainer>
                <AcceptableAnswersCaption>
                    <TextComponent>
                        Réponses {pluralAdjective} <GradeExplanationIcon grade={grade} /> :
                    </TextComponent>
                </AcceptableAnswersCaption>
                {acceptableAnswers.map((acceptableAnswer, acceptableAnswerIndex) => {
                    const formErrorMessage =
                        formErrorHandler.extractAcceptableShuffledPhraseFormErrorMessage(
                            props.formErrors,
                            acceptableAnswerIndex,
                        );
                    return (
                        <>
                            <Row key={`acceptableAnswer-${grade}-${acceptableAnswer.index}`}>
                                {acceptableAnswer.answer.split(' ').map((word) => {
                                    return (
                                        <IsolatedWordContainer>
                                            <IsolatedWord word={word} />
                                        </IsolatedWordContainer>
                                    );
                                })}
                                <RemoveButton
                                    disabled={!canRemoveAcceptableAnswer}
                                    onClick={buildRemoveAcceptableAnswer(acceptableAnswer)}
                                />
                            </Row>
                            {props.shouldDisplayErrors && (
                                <ErrorContainer>
                                    <FormHelperText label={formErrorMessage} />
                                </ErrorContainer>
                            )}
                        </>
                    );
                })}
                {newAcceptableCombinations.map((newAcceptableCombination, combinationIndex) => {
                    const shuffledAnswerState = computeShuffledAnswerState(
                        shuffledPhraseWords,
                        newAcceptableCombination,
                    );

                    return (
                        <WordsShuffler
                            reset={buildResetAcceptableCombination(grade, combinationIndex)}
                            initialWords={shuffledPhraseWords}
                            shuffledAnswerState={shuffledAnswerState}
                            placeWord={buildPlaceWord(grade, combinationIndex)}
                        />
                    );
                })}

                <AddAcceptableAnswerRow>
                    <Button
                        onClick={buildAddNewAcceptableAnswer(grade)}
                        variant="outlined"
                        color="inherit"
                        startIcon={<AddCircleOutlineIcon />}
                    >
                        Ajouter une réponse {singularAdjective}
                    </Button>
                </AddAcceptableAnswerRow>
            </GradeAcceptableAnswersContainer>
        );
    }

    function buildResetAcceptableCombination(
        grade: rightGradeType | okGradeType,
        combinationIndex: number,
    ) {
        return () => {
            const updatedNewAcceptableCombinations = [...newAcceptableCombinationsByGrade[grade]];
            updatedNewAcceptableCombinations[combinationIndex] = [];
            setNewAcceptableCombinationsByGrade({
                ...newAcceptableCombinationsByGrade,
                [grade]: updatedNewAcceptableCombinations,
            });
        };
    }

    function buildPlaceWord(grade: rightGradeType | okGradeType, combinationIndex: number) {
        return (wordIndexToPlace: number) => {
            const newAcceptableCombination = [
                ...newAcceptableCombinationsByGrade[grade][combinationIndex],
                wordIndexToPlace,
            ];
            if (newAcceptableCombination.length === wordCount) {
                const newAcceptableAnswer = {
                    grade,
                    answer: newAcceptableCombination
                        .map((wordIndex) => shuffledPhraseWords[wordIndex])
                        .join(' '),
                };
                props.setAcceptableAnswers([[...props.acceptableAnswers[0], newAcceptableAnswer]]);
                const updatedNewAcceptableCombinations = [
                    ...newAcceptableCombinationsByGrade[grade],
                ];
                updatedNewAcceptableCombinations.splice(combinationIndex, 1);
                setNewAcceptableCombinationsByGrade({
                    ...newAcceptableCombinationsByGrade,
                    [grade]: updatedNewAcceptableCombinations,
                });
            } else {
                const newAcceptableCombinations = [...newAcceptableCombinationsByGrade[grade]];
                newAcceptableCombinations.splice(combinationIndex, 1, newAcceptableCombination);
                setNewAcceptableCombinationsByGrade({
                    ...newAcceptableCombinationsByGrade,
                    [grade]: newAcceptableCombinations,
                });
            }
        };
    }

    function computeCanRemoveAcceptableAnswer(grade: rightGradeType | okGradeType) {
        if (grade === 'A') {
            return aggregatedAcceptableAnswers[grade].length > 1;
        }
        return true;
    }

    function buildAddNewAcceptableAnswer(grade: rightGradeType | okGradeType) {
        return () => {
            setNewAcceptableCombinationsByGrade({
                ...newAcceptableCombinationsByGrade,
                [grade]: [...newAcceptableCombinationsByGrade[grade], []],
            });
        };
    }

    function buildRemoveAcceptableAnswer(acceptableAnswer: aggregatedAcceptableAnswerType) {
        return () => {
            const newAcceptableAnswers = [...props.acceptableAnswers[0]];
            newAcceptableAnswers.splice(acceptableAnswer.index, 1);
            props.setAcceptableAnswers([newAcceptableAnswers]);
        };
    }
}

const Container = styled('div')({ width: '100%' });
const TitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: theme.spacing(1),
}));
const AcceptableAnswersContainer = styled('div')({ display: 'flex', flexDirection: 'column' });
const GradeAcceptableAnswersContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const QuestionIndex = styled(Typography)({ fontWeight: 'bold' });
const Row = styled('div')({ display: 'flex', alignItems: 'center' });
const ErrorContainer = styled('div')(({ theme }) => ({ color: theme.palette.error.main }));
const AcceptableAnswersCaption = styled(Typography)({});
const AddAcceptableAnswerRow = styled('div')({ display: 'flex', justifyContent: 'flex-end' });

export { PhraseMelangeeEditing };
