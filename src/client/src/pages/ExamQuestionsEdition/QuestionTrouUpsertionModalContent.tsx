import { TextField, Typography, styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { QUESTION_TROU_REGEX } from '../../constants';
import { SPLITTING_CHARACTER_FOR_ANSWERS } from './constants';
import { acceptableAnswerWithPointsType } from '../../types';

function QuestionTrouUpsertionModalContent(props: {
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswersWithPoints: acceptableAnswerWithPointsType[];
    setAcceptableAnswersWithPoints: (
        acceptableAnswersWithPoints: acceptableAnswerWithPointsType[],
    ) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const { beforeText, afterText } = computeTexts();
    const rightAnswers = props.acceptableAnswersWithPoints
        .map(({ answer }) => answer)
        .join(SPLITTING_CHARACTER_FOR_ANSWERS);
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
                        value={rightAnswers}
                        onChange={onChangeRightAnswers}
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
                <HintContainer>
                    <Typography variant="h6">
                        Indiquez les réponses correctes, séparées par des point-virgules (;)
                    </Typography>
                </HintContainer>
            </FieldContainer>
            <RowContainer>
                <TextField
                    value={props.points}
                    onChange={(event) => props.setPoints(event.target.value)}
                    label="Point(s) pour la question"
                />
            </RowContainer>
        </>
    );

    function onChangeRightAnswers(event: ChangeEvent<HTMLInputElement>) {
        const newAcceptableAnswerWithPoints = event.target.value
            .split(SPLITTING_CHARACTER_FOR_ANSWERS)
            .map((answer) => ({ answer, points: Number(props.points) }));
        props.setAcceptableAnswersWithPoints(newAcceptableAnswerWithPoints);
    }

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
