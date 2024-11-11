import { TextField, Tooltip, Typography, styled } from '@mui/material';
import { Caption } from '../../components/Caption';
import { FLOATING_NUMBER_REGEX } from '../../../../constants';
import { FormHelperText } from '../../../../components/FormHelperText';
import { CANNOT_EDIT_POINTS_TOOLTIP_TEXT } from '../constants';

const POINTS_TEXT_FIELD_WIDTH = 100;

function PointsPerBlankHandler(props: {
    pointsPerBlank: string;
    setPointsPerBlank: (pointsPerBlank: string) => void;
    setPoints: (points: string) => void;
    blankCount: number;
    canEdit: boolean;
    errorMessage?: string;
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
                if (props.canEdit) {
                    return renderPointsTextField(false);
                }
                return (
                    <Tooltip title={CANNOT_EDIT_POINTS_TOOLTIP_TEXT}>
                        {renderPointsTextField(true)}
                    </Tooltip>
                );
            case 'previewing':
                return props.pointsPerBlank;
        }
    }

    function renderPointsTextField(isDisabled: boolean) {
        return (
            <PointsTextField
                error={!!props.errorMessage}
                disabled={isDisabled}
                helperText={<FormHelperText label={props.errorMessage} />}
                label="Point(s) par trou"
                variant="standard"
                value={`${props.pointsPerBlank}`}
                onChange={onChangePointPerBlank}
            />
        );
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
