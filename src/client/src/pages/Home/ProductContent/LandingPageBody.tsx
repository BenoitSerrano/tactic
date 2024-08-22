import { styled, Typography } from '@mui/material';
import { FeatureCard } from './FeatureCard';

const featureCardsContent = [
    {
        title: 'Rapide',
        description:
            'Automatisez la correction de vos exercices (QCM, textes à trous, phrases à reconstituer, ...) pour gagner un maximum de temps',
    },
    {
        title: 'Sûr',
        description:
            'Minimiser les risques de triche avec une détection en temps réel des comportements suspects',
    },
    {
        title: 'Efficace',
        description:
            "Simplifier le passage de vos examens par vos élèves : pas d'inscription pour eux !",
    },
];

function LandingPageBody() {
    return (
        <Container>
            <Title variant="h3">La plateforme tout-en-un de gestion de vos examens</Title>
            <CardsContainer>
                {featureCardsContent.map(({ title, description }, index) => (
                    <FeatureCard
                        key={`feature-card-${index}`}
                        title={title}
                        description={description}
                    />
                ))}
            </CardsContainer>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    borderTop: `solid 1px ${theme.palette.divider}`,
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(6),
}));
const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(5),
    textAlign: 'center',
}));
const CardsContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-evenly',
}));
export { LandingPageBody };
