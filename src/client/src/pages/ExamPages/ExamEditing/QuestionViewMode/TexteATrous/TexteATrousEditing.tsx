import { acceptableAnswerType } from '../../../../../types';
import { TextField, Typography, styled } from '@mui/material';
import { WordsBlanker } from '../../components/WordsBlanker';
import { converter } from '../../../lib/converter';
import { Caption } from '../components/Caption';
import { FLOATING_NUMBER_REGEX, POINTS_TEXT_FIELD_WIDTH } from '../../../../../constants';
import { useState } from 'react';

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
            <PointsPerBlankContainer>
                <CaptionContainer>
                    <Caption>Nombre de points par trou</Caption> :
                </CaptionContainer>
                <PointsTextField
                    label="Point(s) par trou"
                    variant="standard"
                    value={`${pointsPerBlank}`}
                    onChange={onChangePointPerBlank}
                />
            </PointsPerBlankContainer>
        </Container>
    );

    function onChangePointPerBlank(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            setPointsPerBlank(value);
            props.setPoints(`${Number(value) * props.acceptableAnswers.length}`);
        }
    }
}

const PointsPerBlankContainer = styled(Typography)({ display: 'flex', alignItems: 'baseline' });

const CaptionContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const PointsTextField = styled(TextField)({ width: POINTS_TEXT_FIELD_WIDTH });
const TitleContainer = styled(Typography)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
}));

const Container = styled('div')({ display: 'flex', flexDirection: 'column' });

export { TexteATrousEditing };
