import { TextField, Tooltip } from '@mui/material';
import { CANNOT_EDIT_POINTS_TOOLTIP_TEXT } from '../constants';

function PointsTextField(props: {
    points: string;
    setPoints: (points: string) => void;
    canEdit: boolean;
}) {
    if (props.canEdit) {
        return renderTextField(false);
    }
    return <Tooltip title={CANNOT_EDIT_POINTS_TOOLTIP_TEXT}>{renderTextField(true)}</Tooltip>;

    function renderTextField(isDisabled: boolean) {
        return (
            <TextField
                disabled={isDisabled}
                label="Points"
                value={props.points}
                onChange={(event) => props.setPoints(event.target.value)}
            />
        );
    }
}

export { PointsTextField };
