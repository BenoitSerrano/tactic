import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Typography } from '@mui/material';

function NotFound() {
    return (
        <NotLoggedInPage>
            <Typography variant="h1">La page que vous recherchez n'existe pas.</Typography>
        </NotLoggedInPage>
    );
}

export { NotFound };
