import { styled } from '@mui/material';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { ProductContent } from './ProductContent';
import { PricingContent } from './PricingContent';

function Home() {
    const { hash } = useLocation();
    return (
        <Container>
            <Header />
            {renderContent()}
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
    minHeight: '100vh',
}));

export { Home };
