import { TextField, styled } from '@mui/material';
import { ChangeEvent } from 'react';
import { SPLITTING_CHARACTER_FOR_ANSWERS } from './constants';
import { acceptableAnswerWithPointsType } from '../../types';
import { QuestionInputContainer } from './QuestionInputContainer';

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
    const rightAnswers = props.acceptableAnswersWithPoints
        .map(({ answer }) => answer)
        .join(SPLITTING_CHARACTER_FOR_ANSWERS);

    return (
        <>
            <RowContainer>
                <QuestionInputContainer title="Question à laquelle doit répondre l'élève :">
                    <TextField
                        fullWidth
                        label="Intitulé"
                        value={props.title}
                        onChange={onChangeTitle}
                    />
                </QuestionInputContainer>
            </RowContainer>
            <RowContainer>
                <QuestionInputContainer
                    title="Réponses correctes :"
                    subtitle="Indiquez les réponses correctes, séparées par des point-virgules (;)"
                >
                    <TextField
                        label="Réponses correctes"
                        value={rightAnswers}
                        onChange={onChangeRightAnswers}
                    />
                </QuestionInputContainer>
            </RowContainer>
            <LastRowContainer>
                <QuestionInputContainer title="Nombre de points attribués à la question :">
                    <TextField
                        value={props.points}
                        onChange={(event) => props.setPoints(event.target.value)}
                        label="Point(s)"
                    />
                </QuestionInputContainer>
            </LastRowContainer>
        </>
    );

    function onChangeTitle(event: ChangeEvent<HTMLInputElement>) {
        props.setTitle(event.target.value);
    }

    function onChangeRightAnswers(event: ChangeEvent<HTMLInputElement>) {
        const newAcceptableAnswerWithPoints = event.target.value
            .split(SPLITTING_CHARACTER_FOR_ANSWERS)
            .map((answer) => ({ answer, points: Number(props.points) }));
        props.setAcceptableAnswersWithPoints(newAcceptableAnswerWithPoints);
    }
}

const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    paddingBottom: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.grey[200]}`,
}));

const LastRowContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(2),
    display: 'flex',
}));

export { QuestionTrouUpsertionModalContent };
