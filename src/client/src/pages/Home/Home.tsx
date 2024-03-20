import { styled } from '@mui/material';
import { HomeHeader } from './HomeHeader';
import { useLocation } from 'react-router-dom';
import { ProductContent } from './ProductContent';
import { PricingContent } from './PricingContent';
import { Footer } from './Footer';
import { HEADER_HEIGHT } from '../../constants';

function Home() {
    const { hash } = useLocation();
    return (
        <Container>
            <HomeHeader />
            <ContentContainer>
                {renderContent()}
                <Footer />
            </ContentContainer>
        </Container>
    );

    function renderContent() {
        switch (hash) {
            case '#product':
                return <ProductContent />;
            case '#pricing':
                return <PricingContent />;
            default:
                return <ProductContent />;
        }
    }
}

const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
}));

const ContentContainer = styled('div')({ paddingTop: HEADER_HEIGHT });

export { Home };
