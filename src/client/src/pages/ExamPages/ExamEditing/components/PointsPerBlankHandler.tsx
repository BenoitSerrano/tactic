import { TextField, Typography, styled } from '@mui/material';
import { Caption } from './Caption';
import { FLOATING_NUMBER_REGEX, POINTS_TEXT_FIELD_WIDTH } from '../../../../constants';

function PointsPerBlankHandler(props: {
    pointsPerBlank: string;
    setPointsPerBlank: (pointsPerBlank: string) => void;
    setPoints: (points: string) => void;
    blankCount: number;
    mode: 'editing' | 'previewing';
}) {
    return (
        <PointsPerBlankContainer>
            <CaptionContainer>
                <Caption>Nombre de points par trou</Caption> :
            </CaptionContainer>
            {renderPointsPerBlank()}
        </PointsPerBlankContainer>
    );

    function renderPointsPerBlank() {
        switch (props.mode) {
            case 'editing':
                return (
                    <PointsTextField
                        label="Point(s) par trou"
                        variant="standard"
                        value={`${props.pointsPerBlank}`}
                        onChange={onChangePointPerBlank}
                    />
                );
            case 'previewing':
                return props.pointsPerBlank;
        }
    }

    function onChangePointPerBlank(event: React.ChangeEvent<HTMLInputElement>) {
        const value = event.target.value;
        if (value.match(FLOATING_NUMBER_REGEX)) {
            props.setPointsPerBlank(value);
            props.setPoints(`${Number(value) * props.blankCount}`);
        }
    }
}

const PointsPerBlankContainer = styled(Typography)({ display: 'flex', alignItems: 'baseline' });
const CaptionContainer = styled('span')(({ theme }) => ({
    marginRight: theme.spacing(1),
}));
const PointsTextField = styled(TextField)({ width: POINTS_TEXT_FIELD_WIDTH });

export { PointsPerBlankHandler };
