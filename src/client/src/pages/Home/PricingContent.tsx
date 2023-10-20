import { Typography, styled } from '@mui/material';
import { Offer } from './Offer';
import { Card } from '../../components/Card';

function PricingContent() {
    return (
        <MainContainer>
            <InnerMainContainer>
                <PricingDescriptionContainer>
                    <PricingDescriptionTitleContainer>
                        <Typography variant="h2">Tarifs</Typography>
                    </PricingDescriptionTitleContainer>
                    <Typography variant="h4">
                        Commencer gratuitement en créant votre premier test !
                    </Typography>
                </PricingDescriptionContainer>
                <OffersContainer>
                    <Card>
                        <Offer
                            title="Free"
                            price={0}
                            features={[
                                "Nombre d'élèves illimité",
                                'Nombre de questions par examen illimité',
                                'Un test maximum',
                            ]}
                        />
                    </Card>
                    <Card>
                        <Offer
                            title="Pro"
                            price={5}
                            features={[
                                "Nombre d'élèves illimité",
                                'Nombre de questions par examen illimité',
                                'Nombre de tests illimité',
                                'Statistiques avancées',
                                'Support réactif en moins de 24h',
                            ]}
                        />
                    </Card>
                </OffersContainer>
            </InnerMainContainer>
        </MainContainer>
    );
}

const MainContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flex: 1,
    paddingTop: theme.spacing(5),
    padding: theme.spacing(11),
}));
const InnerMainContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
});
const PricingDescriptionContainer = styled('div')(({ theme }) => ({
    width: '35%',
    marginRight: theme.spacing(4),
}));
const PricingDescriptionTitleContainer = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));
const OffersContainer = styled('div')({
    width: '65%',
    display: 'flex',
    justifyContent: 'space-between',
});

export { PricingContent };
