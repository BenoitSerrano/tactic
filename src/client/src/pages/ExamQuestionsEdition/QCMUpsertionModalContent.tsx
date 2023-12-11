import {
    Button,
    FormControlLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography,
    styled,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { acceptableAnswerWithPointsType } from '../../types';

function QCMUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
    setAcceptableAnswersWithPoints: (
        acceptableAnswersWithPoints: acceptableAnswerWithPointsType[],
    ) => void;
    possibleAnswers: string[];
    setPossibleAnswers: (possibleAnswers: string[]) => void;
    points: number;
}) {
    const rightAnswer: string | undefined = props.acceptableAnswersWithPoints[0]?.answer;
    const canRemovePossibleAnswer = computeCanRemovePossibleAnswer();
    const isAddPossibleAnswerDisabled = computeIsAddPossibleAnswerDisabled();
    return (
        <ModalContent>
            <InputContainer>
                <TextField
                    fullWidth
                    value={props.title}
                    label="Intitulé"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </InputContainer>
            <HintContainer>
                <Typography variant="h6">
                    Indiquez les réponses possibles, et sélectionnez la bonne réponse :
                </Typography>
            </HintContainer>
            <RadioGroup
                value={rightAnswer}
                onChange={(event) =>
                    props.setAcceptableAnswersWithPoints([
                        { answer: event.target.value, points: props.points },
                    ])
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
                    props.setAcceptableAnswersWithPoints([]);
                } else if (index < Number(rightAnswer)) {
                    props.setAcceptableAnswersWithPoints([
                        { answer: `${Number(rightAnswer) - 1}`, points: props.points },
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
const HintContainer = styled('div')(({ theme }) => ({ marginTop: theme.spacing(2) }));

export { QCMUpsertionModalContent };
