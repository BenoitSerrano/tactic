import React from 'react';
import { FormControlLabel, Radio, RadioGroup, TextField, styled } from '@mui/material';

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
                    value={props.title}
                    label="Intitulé"
                    onChange={(event) => props.setTitle(event.target.value)}
                />
            </InputContainer>
            <RadioGroup
                value={rightAnswer}
                onChange={(event) => props.setRightAnswers([event.target.value])}
            >
                {props.possibleAnswers.map(
                    (possibleAnswer: string, possibleAnswerIndex: number) => {
                        return (
                            <InputContainer key={possibleAnswerIndex}>
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
const InputContainer = styled('div')({ marginTop: 4, marginBottom: 4 });

export { QCMUpsertionModalContent };
