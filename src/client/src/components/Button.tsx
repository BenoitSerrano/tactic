import { Button as MuiButton } from '@mui/material';

function Button(props: {
    onClick: () => void;
    children: string;
    variant?: 'contained' | 'outlined' | 'text';
    disabled?: boolean;
}) {
    return (
        <MuiButton variant={props.variant} onClick={props.onClick}>
            {props.children}
        </MuiButton>
    );
}

export { Button };
