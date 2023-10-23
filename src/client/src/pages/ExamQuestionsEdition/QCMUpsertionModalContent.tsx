import { FormControlLabel, Radio, RadioGroup, TextField, Typography, styled } from '@mui/material';

function QCMUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
    possibleAnswers: string[];
    setPossibleAnswers: (possibleAnswers: string[]) => void;
}) {
    const rightAnswer: string | undefined = props.rightAnswers[0];
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
                onChange={(event) => props.setRightAnswers([event.target.value])}
            >
                {props.possibleAnswers.map(
                    (possibleAnswer: string, possibleAnswerIndex: number) => {
                        return (
                            <InputContainer key={'possibleAnswer-' + possibleAnswerIndex}>
                                <FormControlLabel
                                    value={possibleAnswerIndex}
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
                            </InputContainer>
                        );
                    },
                )}
            </RadioGroup>
        </ModalContent>
    );

    function buildOnChangePossibleAnswer(possibleAnswerIndex: number) {
        return (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.target.value.indexOf(',') !== -1) {
                return;
            }
            const possibleAnswers = [...props.possibleAnswers];
            possibleAnswers[possibleAnswerIndex] = event.target.value;
            props.setPossibleAnswers(possibleAnswers);
        };
    }
}

const ModalContent = styled('div')({ width: '100%' });
const InputContainer = styled('div')(({ theme }) => ({
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));
const HintContainer = styled('div')(({ theme }) => ({ marginTop: theme.spacing(2) }));

export { QCMUpsertionModalContent };
