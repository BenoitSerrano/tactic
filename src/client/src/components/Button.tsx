import { Button as MuiButton } from '@mui/material';

function Button(props: {
    fullWidth?: boolean;
    onClick: () => void;
    children: string;
    variant?: 'contained' | 'outlined' | 'text';
    disabled?: boolean;
    type?: 'submit';
}) {
    return (
        <MuiButton
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
