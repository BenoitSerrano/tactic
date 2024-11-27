import GradingIcon from '@mui/icons-material/Grading';
import { Badge, Tooltip } from '@mui/material';

function RemainingPaperIcon(props: { remainingPapers: number }) {
    return (
        <Tooltip title="Nombre de copies corrigées restantes">
            <Badge badgeContent={props.remainingPapers} color="primary">
                <GradingIcon color="action" />
            </Badge>
        </Tooltip>
    );
}

export { RemainingPaperIcon };
