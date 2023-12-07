import DoneIcon from '@mui/icons-material/Done';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import GradingIcon from '@mui/icons-material/Grading';
import ClearIcon from '@mui/icons-material/Clear';
import { Tooltip } from '@mui/material';
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
                    <HourglassBottomIcon color="primary" />
                </Tooltip>
            );
        case 'pending':
            return (
                <Tooltip title="Composition en cours">
                    <PendingActionsIcon color="warning" />
                </Tooltip>
            );
        case 'notStarted':
            return (
                <Tooltip title="Examen non passé">
                    <ClearIcon color="error" />
                </Tooltip>
            );
    }
}

export { computeAttemptStatusIcon };
