import GradingIcon from '@mui/icons-material/Grading';
import { Badge, Tooltip } from '@mui/material';

function RemainingPaperIcon(props: { remainingPapers: number }) {
    return (
        <Tooltip title={`${props.remainingPapers} copies restantes sur votre compte`}>
            <Badge
                showZero
                badgeContent={props.remainingPapers}
                color={props.remainingPapers ? 'primary' : 'warning'}
            >
                <GradingIcon color="action" />
            </Badge>
        </Tooltip>
    );
}

export { RemainingPaperIcon };
