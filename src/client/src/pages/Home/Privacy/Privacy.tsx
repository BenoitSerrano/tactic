import { styled, Typography } from '@mui/material';

function Privacy() {
    return (
        <Container>
            <Title variant="h1">Données personnelles</Title>
            <SectionTitle variant="h4">1. Responsable du traitement des données</SectionTitle>
            <SectionBody>
                Le responsable du traitement des données collectées sur cette plateforme est :<br />
                Nom : Benoit Serrano
                <br />
                Statut : Auto-entrepreneur
                <br />
                SIRET : 90875114200013
                <br />
                Adresse : 178 avenue Daumesnil, 75012 Paris, France
            </SectionBody>
            <SectionTitle variant="h4">2. Données collectées</SectionTitle>
            <SectionBody>
                Nous collectons les données suivantes :
                <ul>
                    <li>
                        <strong>Professeurs</strong> : adresse e-mail, utilisée pour la création de
                        compte, la connexion et l’envoi d’e-mails transactionnels (confirmation
                        d’inscription, réinitialisation de mot de passe, etc.).
                    </li>
                    <li>
                        <strong>Étudiants</strong> : prénom, nom, et adresse e-mail, utilisés pour
                        permettre aux professeurs d’identifier les étudiants dans leur système
                        d’information après la correction des copies.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">3. Finalités du traitement</SectionTitle>
            <SectionBody>
                Les données personnelles sont collectées pour les finalités suivantes :
                <ul>
                    <li>Fournir un accès sécurisé à la plateforme.</li>
                    <li>Permettre la correction et l’identification des copies des étudiants.</li>
                    <li>Envoyer des e-mails transactionnels aux professeurs.</li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">4. Base légale du traitement</SectionTitle>
            <SectionBody>
                Le traitement des données personnelles repose sur les bases légales suivantes :
                <ul>
                    <li>
                        <strong>Pour les professeurs :</strong> consentement lors de la création de
                        leur compte sur la plateforme.
                    </li>
                    <li>
                        <strong>Pour les étudiants :</strong> intérêt légitime dans le cadre de la
                        gestion des examens et de la correction des copies.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">5. Conservation des données</SectionTitle>
            <SectionBody>
                <ul>
                    <li>
                        Les données des professeurs sont conservées tant que leur compte est actif.
                        En cas de suppression du compte, les données seront effacées dans un délai
                        de 12 mois.
                    </li>
                    <li>
                        Les données des étudiants sont conservées pendant une durée de 24 mois après
                        la correction des copies, afin de permettre leur suivi pédagogique, puis
                        elles sont anonymisées.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">6. Sécurité et hébergement</SectionTitle>
            <SectionBody>
                Les données sont hébergées par Scalingo, une plateforme conforme au RGPD, certifiée
                ISO 27001 et HDS, située en France.
                <br />
                Toutes les mesures techniques et organisationnelles nécessaires sont prises pour
                assurer la confidentialité et la sécurité des données.
            </SectionBody>
            <SectionTitle variant="h4">7. Partage des données</SectionTitle>
            <SectionBody>
                Les données personnelles collectées ne sont pas partagées avec des tiers, sauf
                obligation légale ou consentement explicite de l’utilisateur.
            </SectionBody>
            <SectionTitle variant="h4">8. Droits des utilisateurs</SectionTitle>
            <SectionBody>
                Conformément au Règlement Général sur la Protection des Données (RGPD), les
                utilisateurs disposent des droits suivants :
                <ul>
                    <li>Droit d’accès : obtenir une copie des données collectées.</li>
                    <li>Droit de rectification : corriger les données inexactes ou incomplètes.</li>
                    <li>
                        Droit à l’effacement : demander la suppression des données personnelles.
                    </li>
                    <li>
                        Droit à la limitation : restreindre temporairement le traitement des
                        données.
                    </li>
                    <li>
                        Droit à la portabilité : recevoir les données dans un format structuré et
                        lisible.
                    </li>
                    <li>
                        Droit d’opposition : s’opposer au traitement de leurs données pour des
                        raisons légitimes.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">9. Réclamation auprès de l’autorité compétente</SectionTitle>
            <SectionBody>
                Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une
                réclamation à la CNIL (Commission Nationale de l'Informatique et des Libertés).
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

export { Privacy };
