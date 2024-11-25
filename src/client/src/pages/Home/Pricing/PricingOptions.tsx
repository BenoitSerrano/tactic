import { styled, Typography } from '@mui/material';
import { PRICING_PLAN_OPTIONS, pricingPlanNameType } from './constants';

function PricingOptions(props: { selectedPlanName: pricingPlanNameType }) {
    return (
        <Container>
            {PRICING_PLAN_OPTIONS[props.selectedPlanName].map((PRICING_PLAN_OPTION, index) => (
                <OptionContainer
                    key={`option-${index}`}
                    isLastItem={index === PRICING_PLAN_OPTIONS[props.selectedPlanName].length - 1}
                >
                    <OptionLeftPartContainer>
                        <OptionTitle variant="h5">{PRICING_PLAN_OPTION.title}</OptionTitle>
                        <OptionDescription variant="body2">
                            {PRICING_PLAN_OPTION.description}
                        </OptionDescription>
                    </OptionLeftPartContainer>
                    <OptionRightPartContainer>
                        <OptionValue variant="h5">{PRICING_PLAN_OPTION.value}</OptionValue>
                    </OptionRightPartContainer>
                </OptionContainer>
            ))}
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({}));
const OptionContainer = styled('div')<{ isLastItem: boolean }>(({ theme, isLastItem }) => ({
    display: 'flex',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    borderBottom: isLastItem ? undefined : `solid 1px ${theme.palette.common.black}`,
}));
const OptionTitle = styled(Typography)(({ theme }) => ({}));
const OptionDescription = styled(Typography)(({ theme }) => ({}));
const OptionValue = styled(Typography)(({ theme }) => ({ textAlign: 'right' }));
const OptionLeftPartContainer = styled('div')(({ theme }) => ({ width: '70%' }));
const OptionRightPartContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
}));

export { PricingOptions };
