import { styled, Typography } from '@mui/material';
import { Button } from '../../../components/Button';
import { pricingPlanNameType } from './constants';
import { useNavigate } from 'react-router-dom';
import { pathHandler } from '../../../lib/pathHandler';
import { packageApiType } from '../../../lib/api/packagesApi';
import { localSessionHandler } from '../../../lib/localSessionHandler';

function PricingSummary(props: {
    selectedPlanName: pricingPlanNameType;
    selectedPriceIndex: number;
    packages: packageApiType[];
    freePapersCount: number;
}) {
    const navigate = useNavigate();
    const planSummary = computePlanSummary();
    const totalPrice = computeTotalPrice();

    return (
        <Container>
            <Title variant="h4">Votre tarif</Title>
            <SummaryContainer>
                {planSummary.map(({ label, value }) => (
                    <RowContainer key={label}>
                        <LabelContainer>
                            <Typography>{label}</Typography>
                        </LabelContainer>
                        <ValueContainer>
                            <Typography>{value}</Typography>
                        </ValueContainer>
                    </RowContainer>
                ))}
            </SummaryContainer>
            <SummaryRowContainer>
                <LabelContainer>
                    <Typography variant="h4">Prix total</Typography>
                </LabelContainer>
                <ValueContainer>
                    <Typography variant="h4">{totalPrice}</Typography>
                </ValueContainer>
            </SummaryRowContainer>
            <Button fullWidth variant="contained" onClick={onSubscribe}>
                S'inscrire
            </Button>
        </Container>
    );

    function computeTotalPrice() {
        switch (props.selectedPlanName) {
            case 'FREE':
                return '0.00 €';
            case 'PRO':
                return `${props.packages[props.selectedPriceIndex].price.toFixed(2)} €`;
        }
    }

    function computePlanSummary(): Array<{ label: string; value: string }> {
        switch (props.selectedPlanName) {
            case 'FREE':
                return [
                    { label: 'Tarif gratuit', value: '0.00 €' },
                    { label: `${props.freePapersCount} copies`, value: "inclus à l'inscription" },
                    { label: 'Dispositif anti-triche', value: 'inclus' },
                ];
            case 'PRO':
                const { paperCount, price } = props.packages[props.selectedPriceIndex];
                return [
                    { label: `Pack ${paperCount} copies`, value: `${price.toFixed(2)} €` },
                    {
                        label: `${props.freePapersCount} copies supplémentaires`,
                        value: "inclus à l'inscription",
                    },
                    { label: 'Dispositif anti-triche', value: 'inclus' },
                ];
        }
    }

    function onSubscribe() {
        switch (props.selectedPlanName) {
            case 'FREE':
                navigate(pathHandler.getRoutePath('SIGN_UP'));
                break;
            case 'PRO':
                const packageId = props.packages[props.selectedPriceIndex].id;
                const isAuthenticated = localSessionHandler.getIsAuthenticated();
                if (isAuthenticated) {
                    navigate(pathHandler.getRoutePath('TEACHER_HOME', {}, { packageId }));
                } else {
                    navigate(pathHandler.getRoutePath('SIGN_UP', {}, { packageId }));
                }

                break;
        }
    }
}

const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(1),
    textAlign: 'center',
}));
const SummaryContainer = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.common.black}`,
}));
const RowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
}));
const SummaryRowContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
}));
const LabelContainer = styled('div')(({ theme }) => ({}));
const ValueContainer = styled('div')(({ theme }) => ({}));
const Container = styled('div')(({ theme }) => ({}));

export { PricingSummary };
