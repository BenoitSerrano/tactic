import { Typography, styled } from '@mui/material';
import { Offer } from './Offer';

const BORDER_COLOR = '#ddf';

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
                    <OfferContainer>
                        <Offer
                            title="Free"
                            price={0}
                            features={[
                                "Nombre d'élèves illimité",
                                'Nombre de questions par examen illimité',
                                'Un test maximum',
                            ]}
                        />
                    </OfferContainer>
                    <OfferContainer>
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
                    </OfferContainer>
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
const OfferContainer = styled('div')(({ theme }) => ({
    flex: 1,
    padding: 24,
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
    backgroundColor: 'white',
    borderRadius: 10,
    border: `solid 1px ${BORDER_COLOR}`,
}));

export { PricingContent };
