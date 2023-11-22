import DoneIcon from '@mui/icons-material/Done';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import GradingIcon from '@mui/icons-material/Grading';
import { Tooltip, Typography } from '@mui/material';
import { attemptStatusType } from '../types';

function computeAttemptStatusIcon(status: attemptStatusType) {
    switch (status) {
        case 'corrected':
            return (
                <Tooltip title="Copie corrigée">
                    <GradingIcon color="success" />
                </Tooltip>
            );
        case 'finished':
            return (
                <Tooltip title="Copie rendue">
                    <DoneIcon color="primary" />
                </Tooltip>
            );
        case 'expired':
            return (
                <Tooltip title="Temps imparti expiré">
                    <HourglassEmptyIcon color="primary" />
                </Tooltip>
            );
        case 'pending':
            return (
                <Tooltip title="Composition en cours">
                    <PendingActionsIcon color="warning" />
                </Tooltip>
            );
        case 'notStarted':
            return <Typography color="error">-</Typography>;
    }
}

export { computeAttemptStatusIcon };
