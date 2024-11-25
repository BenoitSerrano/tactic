import { styled } from '@mui/material';
import { HomeHeader } from './HomeHeader';
import { Footer } from '../../components/Footer';
import { HEADER_HEIGHT } from '../../constants';
import { ReactNode } from 'react';

function Home(props: { ContentComponent: ReactNode }) {
    const { ContentComponent } = props;
    return (
        <Container>
            <HomeHeader />
            <ContentContainer>
                {ContentComponent}
                <Footer />
            </ContentContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled('div')({ paddingTop: HEADER_HEIGHT });

export { Home };
