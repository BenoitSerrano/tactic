import { Typography } from '@mui/material';

function FormHelperText(props: { label: string | undefined }) {
    if (props.label === undefined) {
        return null;
    }
    return <Typography variant="body2">{props.label}</Typography>;
}

export { FormHelperText };
