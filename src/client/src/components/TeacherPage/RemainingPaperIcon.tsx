import GradingIcon from '@mui/icons-material/Grading';
import { Badge, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../lib/pathHandler';

function RemainingPaperIcon(props: { remainingPapers: number }) {
    const navigate = useNavigate();
    return (
        <IconButton
            title={`Recharger des copies (${props.remainingPapers} restantes)`}
            onClick={goToReloadPapers}
        >
            <Badge
                showZero
                badgeContent={props.remainingPapers}
                color={props.remainingPapers ? 'primary' : 'warning'}
            >
                <GradingIcon color="action" />
            </Badge>
        </IconButton>
    );

    function goToReloadPapers() {
        navigate(pathHandler.getRoutePath('PROFILE'));
    }
}

export { RemainingPaperIcon };
