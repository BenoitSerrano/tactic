import { acceptableAnswerType } from '../../../../../types';
import { TextField, Typography, styled } from '@mui/material';
import { WordsBlanker } from '../../components/WordsBlanker';
import { converter } from '../../../lib/converter';
import { Caption } from '../../components/Caption';
import { FLOATING_NUMBER_REGEX, POINTS_TEXT_FIELD_WIDTH } from '../../../../../constants';
import { useState } from 'react';
import { PointsPerBlankHandler } from '../../components/PointsPerBlankHandler';

function TexteATrousEditing(props: {
    index: number;
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
            <PointsPerBlankHandler
                mode="editing"
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

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { TexteATrousEditing };
