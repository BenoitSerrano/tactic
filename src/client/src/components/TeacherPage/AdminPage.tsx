import { styled } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { HEADER_HEIGHT } from '../../constants';
import { localSessionHandler } from '../../lib/localSessionHandler';
import { Header } from '../Header';
import { Logo } from '../Logo';

function AdminPage(props: { children: React.ReactNode | null }) {
    const userRoles = localSessionHandler.getUserRoles();

    if (!userRoles || !userRoles.includes('admin')) {
        return <Navigate to="/sign-in" />;
    }

    return (
        <Container>
            <Header buttons={[]} LeftContent={<Logo variant="full" />} MiddleContent={<></>} />

            <ContentContainer>
                <ChildrenContainer>{props.children}</ChildrenContainer>
            </ContentContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled('div')({
    paddingTop: HEADER_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
});
const ChildrenContainer = styled('div')({ flex: 1, display: 'flex', flexDirection: 'column' });

export { AdminPage };
