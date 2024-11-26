import { styled, Typography } from '@mui/material';
import { PricingToggle } from './PricingToggle';
import { useState } from 'react';
import { pricingPlanNameType } from './constants';
import { PricingSlider } from './PricingSlider';
import { PricingOptions } from './PricingOptions';
import { PricingSummary } from './PricingSummary';

function Pricing() {
    const [selectedPlanName, setSelectedPlanName] = useState<pricingPlanNameType>('PRO');
    const [selectedPriceIndex, setSelectedPriceIndex] = useState(0);

    return (
        <MainContainer>
            <Title variant="h1">Tarifs</Title>
            <Subtitle variant="h3">Des tarifs flexibles adaptés à vos besoins</Subtitle>
            <PricingBox>
                <LeftContainer>
                    <PricingToggleContainer>
                        <PricingToggle
                            selectedPlanName={selectedPlanName}
                            setSelectedPlanName={setSelectedPlanName}
                        />
                    </PricingToggleContainer>
                    {selectedPlanName === 'PRO' && (
                        <PricingSliderContainer>
                            <PricingSlider
                                selectedIndex={selectedPriceIndex}
                                setSelectedIndex={setSelectedPriceIndex}
                            />
                        </PricingSliderContainer>
                    )}
                    <PricingOptions selectedPlanName={selectedPlanName} />
                </LeftContainer>
                <RightContainer>
                    <PricingSummary
                        selectedPriceIndex={selectedPriceIndex}
                        selectedPlanName={selectedPlanName}
                    />
                </RightContainer>
            </PricingBox>
        </MainContainer>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    padding: theme.spacing(5),
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
}));
const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    textAlign: 'center',
}));
const Subtitle = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(5),
    textAlign: 'center',
}));
const PricingBox = styled('div')(({ theme }) => ({
    borderRadius: '40px',
    display: 'flex',
    width: '100%',
    border: `2px solid ${theme.palette.primary.main}`,
}));
const PricingToggleContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(3) }));
const PricingSliderContainer = styled('div')(({ theme }) => ({ marginBottom: theme.spacing(3) }));
const LeftContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(5),
    flex: 2,
    borderRight: `2px solid ${theme.palette.primary.main}`,
}));
const RightContainer = styled('div')(({ theme }) => ({
    padding: theme.spacing(5),
    flex: 1,
}));
export { Pricing };
