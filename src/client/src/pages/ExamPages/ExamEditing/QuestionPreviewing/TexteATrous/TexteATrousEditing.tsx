import { Typography, styled } from '@mui/material';
import { useState } from 'react';
import { acceptableAnswerType } from '../../../../../types';
import { WordsBlanker } from '../../components/WordsBlanker';
import { converter } from '../../../lib/converter';
import { PointsPerBlankHandler } from '../../components/PointsPerBlankHandler';
import { formErrorHandler } from '../../lib/formErrorHandler';
import { FormHelperText } from '../../../../../components/FormHelperText';

function TexteATrousEditing(props: {
    index: number;
    formErrors: string[];
    shouldDisplayErrors: boolean;
    title: string;
    setTitle: (title: string) => void;
    acceptableAnswers: acceptableAnswerType[][];
    setAcceptableAnswers: (acceptableAnswers: acceptableAnswerType[][]) => void;
    points: string;
    setPoints: (points: string) => void;
}) {
    const blankCount = converter.computeBlankCount(props.title);
    const initialPointsPerBlank = Number(props.points) / blankCount;
    const [pointsPerBlank, setPointsPerBlank] = useState(`${initialPointsPerBlank}`);
    const pointsPerBlankErrorMessage = formErrorHandler.extractPointsFormErrorMessage(
        props.formErrors,
    );
    const rightAnswerPresenceErrorMessage =
        formErrorHandler.extractRightAnswerPresenceFormErrorMessageForTaT(props.formErrors);
    return (
        <Container>
            <TitleContainer>
                {props.index}.{' '}
                <WordsBlanker
                    title={props.title}
                    setTitle={props.setTitle}
                    acceptableAnswers={props.acceptableAnswers}
                    setAcceptableAnswers={props.setAcceptableAnswers}
                    pointsPerBlank={Number(pointsPerBlank)}
                    setPoints={(points) => props.setPoints(`${points}`)}
                />
            </TitleContainer>
            <FormHelperTextContainer>
                <FormHelperText label={rightAnswerPresenceErrorMessage} />
            </FormHelperTextContainer>
            <PointsPerBlankHandler
                mode="editing"
                errorMessage={props.shouldDisplayErrors ? pointsPerBlankErrorMessage : undefined}
                blankCount={blankCount}
                pointsPerBlank={pointsPerBlank}
                setPoints={props.setPoints}
                setPointsPerBlank={setPointsPerBlank}
            />
        </Container>
    );
}

const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const FormHelperTextContainer = styled('div')(({ theme }) => ({ color: theme.palette.error.main }));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { TexteATrousEditing };
