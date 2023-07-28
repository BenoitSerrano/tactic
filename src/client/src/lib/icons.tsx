import React from 'react';
import DoneIcon from '@mui/icons-material/Done';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Typography } from '@mui/material';

const iconLib = {
    computeIconColor,
};

function computeIconColor(status: 'blank' | 'pending' | 'done') {
    switch (status) {
        case 'done':
            return <DoneIcon color="success" />;
        case 'pending':
            return <PendingActionsIcon color="warning" />;

        case 'blank':
            return <Typography color="error">-</Typography>;
        default:
            return <Typography color="error">-</Typography>;
    }
}

export { iconLib };
