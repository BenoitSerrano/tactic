import DoneIcon from '@mui/icons-material/Done';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Typography } from '@mui/material';
import { examStatusType } from '../types';

function computeIconColor(status: examStatusType) {
    switch (status) {
        case 'finished':
            return <DoneIcon color="success" />;
        case 'expired':
            return <DoneIcon color="success" />;
        case 'pending':
            return <PendingActionsIcon color="warning" />;
        case 'notStarted':
            return <Typography color="error">-</Typography>;
        default:
            return <Typography color="error">-</Typography>;
    }
}

export { computeIconColor };
