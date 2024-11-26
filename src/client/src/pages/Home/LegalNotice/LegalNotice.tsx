import { styled, Typography } from '@mui/material';

function LegalNotice() {
    return (
        <Container>
            <Title variant="h1">Mentions légales</Title>
            <SectionTitle variant="h4">Éditeur du site</SectionTitle>
            <SectionBody>
                Nom : Benoit Serrano
                <br />
                Statut : Auto-entrepreneur
                <br />
                SIRET : 90875114200013
                <br />
                Adresse : 178 avenue Daumesnil, 75012 Paris, France
            </SectionBody>
            <SectionTitle variant="h4">Hébergement</SectionTitle>
            <SectionBody>
                L’application est hébergée sur Scalingo, une plateforme conforme au RGPD, certifiée
                ISO 27001 et HDS. Les données sont stockées exclusivement en France sur des serveurs
                sécurisés.
            </SectionBody>
            <SectionTitle variant="h4">Plateforme de paiement</SectionTitle>
            <SectionBody>
                Les transactions financières effectuées sur la plateforme sont gérées par Stripe,
                une plateforme conforme aux standards de sécurité PCI-DSS.
            </SectionBody>
            <SectionTitle variant="h4">
                Collecte et traitement des données personnelles
            </SectionTitle>
            <SectionBody>
                <ul>
                    <li>
                        <strong>Professeurs :</strong> Nous collectons les adresses e-mail des
                        professeurs pour leur permettre de se connecter à la plateforme et recevoir
                        des e-mails transactionnels (réinitialisation de mot de passe, confirmation
                        de création de compte, etc.).
                    </li>
                    <li>
                        <strong>Étudiants :</strong> Nous collectons le prénom, le nom, et l’adresse
                        e-mail des étudiants afin de permettre aux professeurs de les identifier
                        dans leur système d’information après la correction des copies.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">Protection des données</SectionTitle>
            <SectionBody>
                Nous respectons les réglementations européennes en matière de protection des données
                (RGPD). Aucune donnée n’est partagée avec des tiers sans consentement explicite.
            </SectionBody>
        </Container>
    );
}

const Container = styled('div')(({ theme }) => ({ padding: theme.spacing(5) }));
const Title = styled(Typography)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));
const SectionTitle = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(1) }));
const SectionBody = styled(Typography)(({ theme }) => ({ marginBottom: theme.spacing(2) }));

export { LegalNotice };
