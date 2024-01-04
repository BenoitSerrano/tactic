import { FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { Button } from '../../../../components/Button';
import { acceptableAnswerType } from '../../../../types';
import { formErrorHandler } from '../lib/formErrorHandler';
import { FormHelperText } from '../../../../components/FormHelperText';

function QcmEditing(props: {
    index: number;
    formErrors: string[];
    shouldDisplayErrors: boolean;
    title: string;
    setTitle: (title: string) => void;
    possibleAnswers: string[];
    setPossibleAnswers: (possibleAnswers: string[]) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
}) {
    const rightAnswer: string | undefined = props.acceptableAnswers.length
        ? props.acceptableAnswers[0][0].answer
        : undefined;
    const canRemovePossibleAnswer = computeCanRemovePossibleAnswer();
    const isAddPossibleAnswerDisabled = computeIsAddPossibleAnswerDisabled();
    const titleFormErrorMessage = formErrorHandler.extractTitleFormErrorMessage(props.formErrors);
    return (
        <Container>
            <TitleContainer>
                <TextField
                    error={props.shouldDisplayErrors && titleFormErrorMessage !== undefined}
                    helperText={
                        props.shouldDisplayErrors && (
                            <FormHelperText label={titleFormErrorMessage} />
                        )
                    }
                    fullWidth
                    label="Intitulé"
                    placeholder="Intitulé de la question"
                    value={props.title}
                    variant="standard"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </TitleContainer>
            <PossibleAnswersContainer>
                <RadioGroup
                    value={rightAnswer}
                    onChange={(event) => {
                        props.setAcceptableAnswers([[{ answer: event.target.value, grade: 'A' }]]);
                    }}
                >
                    {props.possibleAnswers.map(
                        (possibleAnswer: string, possibleAnswerIndex: number) => {
                            const formErrorMessage =
                                formErrorHandler.extractPossibleAnswerFormErrorMessage(
                                    props.formErrors,
                                    possibleAnswerIndex,
                                );
                            return (
                                <InputContainer key={'possibleAnswer-' + possibleAnswerIndex}>
                                    <PossibleAnswerFormControlLabel
                                        value={`${possibleAnswerIndex}`}
                                        control={<StyledCorrectRadio />}
                                        label={
                                            <PossibleAnswerTextField
                                                error={
                                                    props.shouldDisplayErrors && !!formErrorMessage
                                                }
                                                helperText={
                                                    props.shouldDisplayErrors && (
                                                        <FormHelperText label={formErrorMessage} />
                                                    )
                                                }
                                                label={`Réponse n°${possibleAnswerIndex + 1}`}
                                                fullWidth
                                                variant="standard"
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
                        color="inherit"
                        startIcon={<AddCircleOutlineIcon />}
                        disabled={isAddPossibleAnswerDisabled}
                    >
                        Ajouter une réponse possible
                    </Button>
                </ButtonAddPossibleAnswerContainer>
            </PossibleAnswersContainer>
        </Container>
    );
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
}

const Container = styled('div')({ width: '100%' });
const TitleContainer = styled('div')({
    display: 'flex',
    alignItems: 'baseline',
});
const PossibleAnswersContainer = styled('div')({ width: '100%' });

const ButtonAddPossibleAnswerContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
}));
const InputContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    width: '100%',
}));

const PossibleAnswerTextField = styled(TextField)({
    width: '100%',
});

const StyledCorrectRadio = styled(Radio)(({ theme }) => ({
    '&.Mui-checked': {
        color: theme.palette.success.main,
    },
}));

const PossibleAnswerFormControlLabel = styled(FormControlLabel)({
    '&.MuiFormControlLabel-root': {
        width: '100%',
    },
    '.MuiFormControlLabel-label': {
        width: '100%',
    },
});

export { QcmEditing };
