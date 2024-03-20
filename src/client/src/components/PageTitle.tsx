import { Typography } from '@mui/material';

function PageTitle(props: { title: string }) {
    return <Typography variant="h3">{props.title}</Typography>;
}

export { PageTitle };
