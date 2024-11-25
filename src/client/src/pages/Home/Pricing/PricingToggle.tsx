import { styled, Typography } from '@mui/material';
import { palette } from '../../../theme/palette';
import { PRICING_PLAN_NAMES, PRICING_PLANS, pricingPlanNameType } from './constants';

function PricingToggle(props: {
    selectedPlanName: pricingPlanNameType;
    setSelectedPlanName: (selectedPlanName: pricingPlanNameType) => void;
}) {
    return (
        <Container>
            {PRICING_PLAN_NAMES.map((PRICING_OPTION_NAME) => (
                <PricingOptionBox
                    isActive={props.selectedPlanName === PRICING_OPTION_NAME}
                    onClick={buildOnSelectPricingOption(PRICING_OPTION_NAME)}
                    key={PRICING_OPTION_NAME}
                >
                    <PricingOptionTitle variant="h4">
                        {PRICING_PLANS[PRICING_OPTION_NAME].title}
                    </PricingOptionTitle>
                    <PricingOptionDescription>
                        {PRICING_PLANS[PRICING_OPTION_NAME].description}
                    </PricingOptionDescription>
                </PricingOptionBox>
            ))}
        </Container>
    );

    function buildOnSelectPricingOption(pricingOptionName: pricingPlanNameType) {
        return () => {
            props.setSelectedPlanName(pricingOptionName);
        };
    }
}

const Container = styled('div')(({ theme }) => ({
    display: 'flex',
    borderRadius: '20px',
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1),
}));
const PricingOptionBox = styled('div')<{ isActive: boolean }>(({ theme, isActive }) => ({
    padding: theme.spacing(2),
    flex: 1,
    borderRadius: '25px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    backgroundColor: isActive ? palette.common.white : theme.palette.primary.dark,
    color: isActive ? theme.palette.common.black : theme.palette.common.white,
}));
const PricingOptionTitle = styled(Typography)(({ theme }) => ({ textAlign: 'center' }));
const PricingOptionDescription = styled(Typography)(({ theme }) => ({ textAlign: 'center' }));

export { PricingToggle };
export { PRICING_PLANS };
