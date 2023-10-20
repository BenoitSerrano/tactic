import React from 'react';
import { styled } from '@mui/material';
import { Header } from './Header';
import { useLocation } from 'react-router-dom';
import { ProductContent } from './ProductContent';
import { PricingContent } from './PricingContent';
import { ContactContent } from './ContactContent';

const BACKGROUND_COLOR = '#fafaff';

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
            case '#contact':
                return <ContactContent />;
            default:
                return <ProductContent />;
        }
    }
}

const Container = styled('div')({
    backgroundColor: BACKGROUND_COLOR,
    minHeight: '100vh',
});

export { Home };
