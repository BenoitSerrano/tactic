import { styled, Typography } from '@mui/material';

function TermsAndConditionsOfSale() {
    return (
        <Container>
            <Title variant="h1">Conditions Générales de Vente</Title>
            <SectionTitle variant="h4">1. Objet</SectionTitle>
            <SectionBody>
                Les présentes Conditions Générales de Vente (CGV) régissent les relations
                contractuelles entre Benoit Serrano, auto-entrepreneur (ci-après "l’Éditeur"), et
                tout utilisateur souhaitant utiliser les services proposés par l’application
                (ci-après "le Client").
            </SectionBody>
            <SectionTitle variant="h4">2. Offre et Tarifs</SectionTitle>
            <SectionBody>
                <ul>
                    <li>
                        <strong>Section gratuite :</strong> Chaque professeur bénéficie de la
                        correction gratuite des 20 premières copies.
                    </li>
                    <li>
                        <strong>Lots de copies corrigées :</strong> Les Clients peuvent acheter des
                        lots correspondant à un nombre prédéfini de copies corrigées. Le prix
                        unitaire par copie est dégressif en fonction de la taille du lot.
                    </li>
                </ul>
                <em>Exemple :</em>
                <ul>
                    <li>Lot de 100 copies : X € (soit Y € par copie)</li>
                    <li>Lot de 500 copies : Z € (soit moins de Y € par copie)</li>
                </ul>
                Les lots achetés sont utilisables sans limite de temps.
            </SectionBody>
            <SectionTitle variant="h4">3. Paiement</SectionTitle>
            <SectionBody>
                Les paiements sont effectués via Stripe, une plateforme de paiement sécurisée et
                conforme aux standards PCI-DSS.
                <ul>
                    <li>
                        Les prix sont exprimés en euros (€) et incluent toutes taxes applicables.
                    </li>
                    <li>Le paiement doit être effectué au moment de l’achat du lot.</li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">4. Politique de Remboursement</SectionTitle>
            <SectionBody>
                <ul>
                    <li>Aucun remboursement n’est effectué en cas d’insatisfaction du Client.</li>
                    <li>
                        En cas de problème technique avéré durant un examen (ex. interruption de
                        service empêchant la correction des copies), les frais liés à la correction
                        de cet examen seront intégralement remboursés.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">5. Utilisation des lots de copies corrigées</SectionTitle>
            <SectionBody>
                <ul>
                    <li>
                        Les lots achetés sont valables indéfiniment et ne sont pas soumis à une date
                        d’expiration.
                    </li>
                    <li>
                        Les lots sont liés au compte du professeur acheteur et ne peuvent être
                        transférés à un autre compte sans autorisation préalable.
                    </li>
                </ul>
            </SectionBody>
            <SectionTitle variant="h4">6. Hébergement et Sécurité des données</SectionTitle>
            <SectionBody>
                L’application est hébergée par Scalingo, un fournisseur conforme au RGPD, certifié
                ISO 27001 et HDS. Les données sont hébergées exclusivement en France.
            </SectionBody>
            <SectionTitle variant="h4">7. Modifications des CGV</SectionTitle>
            <SectionBody>
                L’Éditeur se réserve le droit de modifier les présentes CGV à tout moment. Toute
                modification sera notifiée au Client via la plateforme.
            </SectionBody>
            <SectionTitle variant="h4">8. Droit applicable</SectionTitle>
            <SectionBody>
                Les présentes CGV sont soumises à la législation française. Tout litige sera soumis
                à la compétence exclusive des tribunaux français.
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

export { TermsAndConditionsOfSale };
