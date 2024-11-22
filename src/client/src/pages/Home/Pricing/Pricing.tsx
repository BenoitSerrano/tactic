import { Typography, styled } from '@mui/material';
import { Card } from '../../../components/Card';
import { Offer } from './Offer';

function Pricing() {
    return (
        <MainContainer>
            <InnerMainContainer>
                <PricingDescriptionContainer>
                    <PricingDescriptionTitleContainer>
                        <Typography variant="h2">Tarifs</Typography>
                    </PricingDescriptionTitleContainer>
                    <Typography variant="h4">
                        Commencer gratuitement en créant votre premier examen !
                    </Typography>
                </PricingDescriptionContainer>
                <OffersContainer>
                    <CardContainer>
                        <Card style={{ flex: 1 }}>
                            <Offer
                                title="ESSAI GRATUIT"
                                price={0}
                                features={['30 copies maximum', 'Un examen maximum']}
                            />
                        </Card>
                    </CardContainer>
                    <CardContainer>
                        <Card style={{ flex: 1 }}>
                            <Offer
                                title="PRO"
                                price={12}
                                features={[
                                    "Jusqu'à 200 copies par mois",
                                    "Jusqu'à 5 examens par mois",
                                    'Support réactif en moins de 24h',
                                ]}
                            />
                        </Card>
                    </CardContainer>
                    <CardContainer>
                        <Card style={{ flex: 1 }}>
                            <Offer
                                title="ILLIMITÉ"
                                price={16}
                                features={[
                                    'Copies illimitées',
                                    'Examens illimités',
                                    'Support réactif en moins de 24h',
                                ]}
                            />
                        </Card>
                    </CardContainer>
                </OffersContainer>
            </InnerMainContainer>
        </MainContainer>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: 1,
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(9),
        paddingTop: theme.spacing(6),
    },
    [theme.breakpoints.down('md')]: {
        padding: theme.spacing(3),
        paddingTop: theme.spacing(2),
    },
}));
const InnerMainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    width: '100%',
}));
const PricingDescriptionContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: '35%',
        marginRight: theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
        width: '50%',
        textAlign: 'center',
        marginBottom: theme.spacing(4),
    },
}));
const PricingDescriptionTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));
const OffersContainer = styled('div')(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        width: '65%',
    },
    [theme.breakpoints.down('md')]: {
        width: '95%',
    },
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
    },
    justifyContent: 'space-between',
}));
const CardContainer = styled('div')(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
        marginBottom: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
        marginRight: theme.spacing(2),
    },
}));

export { Pricing };
