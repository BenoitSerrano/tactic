import { styled } from '@mui/material/styles';
import { Header } from '../Header';
import { HEADER_HEIGHT } from '../../constants';
import { Logo } from '../Logo';
import { SettingsIconButton } from './SettingsIcon';
import { StudentConfigHandlerContextProvider } from '../../lib/studentConfig';

function StudentPage(props: { children: React.ReactNode; title?: JSX.Element }) {
    return (
        <StudentConfigHandlerContextProvider>
            <Container>
                <Header
                    buttons={[<SettingsIconButton />]}
                    LeftContent={<Logo variant="full" />}
                    MiddleContent={<TitleContainer>{props.title}</TitleContainer>}
                />
                <ChildrenContainer>{props.children}</ChildrenContainer>
            </Container>
        </StudentConfigHandlerContextProvider>
    );
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: theme.palette.background.default,
}));
const ChildrenContainer = styled('div')({
    paddingTop: HEADER_HEIGHT,
    display: 'flex',
    flex: 1,
});
const TitleContainer = styled('div')({ flex: 1 });

export { StudentPage };
