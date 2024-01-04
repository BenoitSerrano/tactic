import { Button, FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { QuestionInputContainer } from './QuestionInputContainer';
import { acceptableAnswerType } from '../../../../types';

function QCMUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
    possibleAnswers: string[];
    setPossibleAnswers: (possibleAnswers: string[]) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const rightAnswer: string | undefined = props.acceptableAnswers.length
        ? props.acceptableAnswers[0][0].answer
        : undefined;
    const canRemovePossibleAnswer = computeCanRemovePossibleAnswer();
    const isAddPossibleAnswerDisabled = computeIsAddPossibleAnswerDisabled();
    return (
        <ModalContent>
            <QuestionInputContainer title="Question à laquelle doit répondre l'élève">
                <TextField
                    autoFocus
                    fullWidth
                    value={props.title}
                    label="Intitulé"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </QuestionInputContainer>
            <QuestionInputContainer
                title="Réponses possibles"
                subtitle="Indiquez les réponses possibles, et sélectionnez la bonne réponse"
            >
                <RadioGroup
                    value={rightAnswer}
                    onChange={(event) =>
                        props.setAcceptableAnswers([[{ answer: event.target.value, grade: 'A' }]])
                    }
                >
                    {props.possibleAnswers.map(
                        (possibleAnswer: string, possibleAnswerIndex: number) => {
                            return (
                                <InputContainer key={'possibleAnswer-' + possibleAnswerIndex}>
                                    <FormControlLabel
                                        value={`${possibleAnswerIndex}`}
                                        control={<Radio />}
                                        label={
                                            <TextField
                                                label={`Réponse n°${possibleAnswerIndex + 1}`}
                                                fullWidth
                                                value={possibleAnswer}
                                                onChange={buildOnChangePossibleAnswer(
                                                    possibleAnswerIndex,
                                                )}
                                            />
                                        }
                                    />
                                    <Button
                                        onClick={buildRemovePossibleAnswer(possibleAnswerIndex)}
                                        variant="outlined"
                                        color="error"
                                        startIcon={<RemoveCircleOutlineIcon />}
                                        disabled={!canRemovePossibleAnswer}
                                    >
                                        Retirer
                                    </Button>
                                </InputContainer>
                            );
                        },
                    )}
                </RadioGroup>
                <ButtonAddPossibleAnswerContainer>
                    <Button
                        onClick={addPossibleAnswer}
                        variant="outlined"
                        startIcon={<AddCircleOutlineIcon />}
                        disabled={isAddPossibleAnswerDisabled}
                    >
                        Ajouter
                    </Button>
                </ButtonAddPossibleAnswerContainer>
            </QuestionInputContainer>
            <QuestionInputContainer isLastItem title="Nombre de points attribués à la question">
                <TextField
                    value={props.points}
                    onChange={(event) => props.setPoints(event.target.value)}
                    label="Point(s)"
                />
            </QuestionInputContainer>
        </ModalContent>
    );

    function computeCanRemovePossibleAnswer() {
        return props.possibleAnswers.length > 2;
    }
    function computeIsAddPossibleAnswerDisabled() {
        return props.possibleAnswers.length >= 10;
    }

    function buildRemovePossibleAnswer(index: number) {
        return () => {
            const newPossibleAnswers = [...props.possibleAnswers];
            newPossibleAnswers.splice(index, 1);
            props.setPossibleAnswers(newPossibleAnswers);
            if (rightAnswer !== undefined) {
                if (index === Number(rightAnswer)) {
                    props.setAcceptableAnswers([]);
                } else if (index < Number(rightAnswer)) {
                    props.setAcceptableAnswers([
                        [{ answer: `${Number(rightAnswer) - 1}`, grade: 'A' }],
                    ]);
                }
            }
        };
    }

    function addPossibleAnswer() {
        props.setPossibleAnswers([...props.possibleAnswers, '']);
    }

    function buildOnChangePossibleAnswer(possibleAnswerIndex: number) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            const possibleAnswers = [...props.possibleAnswers];
            possibleAnswers[possibleAnswerIndex] = event.target.value;
            props.setPossibleAnswers(possibleAnswers);
        };
    }
}

const ButtonAddPossibleAnswerContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
}));

const ModalContent = styled('div')({ width: '100%' });
const InputContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

export { QCMUpsertionModalContent };
