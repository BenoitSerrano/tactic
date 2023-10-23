import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { QUESTION_TROU_REGEX } from '../../constants';
import { SPLITTING_CHARACTER_FOR_ANSWERS } from './constants';

function QuestionTrouUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    rightAnswers: string[];
    setRightAnswers: (rightAnswers: string[]) => void;
    acceptableAnswers: string[];
    setAcceptableAnswers: (acceptableAnswers: string[]) => void;
}) {
    const { beforeText, afterText } = computeTexts();
    return (
        <>
            <FieldContainer>
                <RowContainer>
                    <TextField
                        variant="standard"
                        label="Début de la question..."
                        value={beforeText}
                        onChange={onChangeBeforeText}
                        placeholder="Les paroles"
                    />
                    <TextField
                        variant="standard"
                        label="Bonnes réponses"
                        placeholder="s'envolent"
                        value={props.rightAnswers.join(SPLITTING_CHARACTER_FOR_ANSWERS)}
                        onChange={(event) =>
                            props.setRightAnswers(
                                event.target.value.split(SPLITTING_CHARACTER_FOR_ANSWERS),
                            )
                        }
                    />
                    <TextField
                        variant="standard"
                        label="... suite de la question"
                        value={afterText}
                        onChange={onChangeAfterText}
                        placeholder=", les écrits restent."
                    />
                </RowContainer>
            </FieldContainer>
            <FieldContainer>
                <TextField
                    fullWidth
                    variant="standard"
                    label="Réponses acceptables"
                    value={props.acceptableAnswers.join(SPLITTING_CHARACTER_FOR_ANSWERS)}
                    onChange={(event) =>
                        props.setAcceptableAnswers(
                            event.target.value.split(SPLITTING_CHARACTER_FOR_ANSWERS),
                        )
                    }
                />
                <HintContainer>
                    <Typography variant="h6">
                        Indiquez les réponses acceptables, séparées par des point-virgules (;)
                    </Typography>
                </HintContainer>
            </FieldContainer>
        </>
    );

    function computeTexts() {
        const match = props.title.match(QUESTION_TROU_REGEX);
        if (!match) {
            console.error(`Title wrongly formatted: "${props.title}"`);
            return { beforeText: '', afterText: '' };
        }
        const beforeText = match[1];
        const afterText = match[2];
        return { beforeText, afterText };
    }

    function onChangeBeforeText(event: ChangeEvent<HTMLInputElement>) {
        const beforeText = event.target.value;
        const title = `${beforeText}....${afterText}`;
        props.setTitle(title);
    }
    function onChangeAfterText(event: ChangeEvent<HTMLInputElement>) {
        const afterText = event.target.value;
        const title = `${beforeText}....${afterText}`;
        props.setTitle(title);
    }
}

const FieldContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    flex: 1,
    width: '100%',
}));

const RowContainer = styled('div')({ display: 'flex' });

const HintContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(2) }));

export { QuestionTrouUpsertionModalContent };
