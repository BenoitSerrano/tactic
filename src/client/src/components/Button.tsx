import { Button as MuiButton } from '@mui/material';
import { ReactNode } from 'react';

function Button(props: {
    fullWidth?: boolean;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    children: string | ReactNode;
    variant?: 'contained' | 'outlined' | 'text';
    disabled?: boolean;
    type?: 'submit';
    title?: string;
    startIcon?: JSX.Element;
    endIcon?: JSX.Element;
    autoFocus?: boolean;
    color?: 'primary' | 'error' | 'inherit' | 'success' | 'warning';
}) {
    return (
        <MuiButton
            color={props.color}
            autoFocus={props.autoFocus}
            title={props.title}
            startIcon={props.startIcon}
            endIcon={props.endIcon}
            type={props.type}
            fullWidth={props.fullWidth}
            variant={props.variant}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </MuiButton>
    );
}

export { Button };
