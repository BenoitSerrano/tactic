import { Page } from '../components/Page';
import { Typography } from '@mui/material';

function NotFound() {
    return (
        <Page>
            <Typography variant="h1">La page que vous recherchez n'existe pas.</Typography>
        </Page>
    );
}

export { NotFound };
