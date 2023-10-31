import { NotLoggedInPage } from '../components/NotLoggedInPage';
import { Typography, styled } from '@mui/material';

function NotFound() {
    return (
        <NotLoggedInPage>
            <ContentContainer>
                <Typography variant="h1">La page que vous recherchez n'existe pas.</Typography>
            </ContentContainer>
        </NotLoggedInPage>
    );
}

const ContentContainer = styled('div')({
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
});

export { NotFound };
