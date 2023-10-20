import { Button as MuiButton } from '@mui/material';

function Button(props: {
    onClick: () => void;
    children: string;
    variant?: 'contained';
    disabled?: boolean;
}) {
    return <MuiButton onClick={props.onClick}>{props.children}</MuiButton>;
}

export { Button };
