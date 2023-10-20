import { styled } from '@mui/material';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { ProductContent } from './ProductContent';
import { PricingContent } from './PricingContent';
import { Footer } from './Footer';

function Home() {
    const { hash } = useLocation();
    return (
        <Container>
            <Header />
            {renderContent()}
            <Footer />
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

export { Home };
