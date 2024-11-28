import { styled, Typography } from '@mui/material';
import { planOptionType, pricingPlanNameType } from './constants';

function PricingOptions(props: { selectedPlanName: pricingPlanNameType; freePapersCount: number }) {
    const pricingPlanOptions = computePricingPlanOptions();
    return (
        <Container>
            {pricingPlanOptions.map((PRICING_PLAN_OPTION, index) => (
                <OptionContainer
                    key={`option-${index}`}
                    isLastItem={index === pricingPlanOptions.length - 1}
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

    function computePricingPlanOptions(): planOptionType[] {
        switch (props.selectedPlanName) {
            case 'FREE':
                return [
                    {
                        title: 'Nombre de copies corrigées offertes',
                        description:
                            'Ces copies vous seront offertes à la création du compte quel que soit le plan choisi',
                        value: `${props.freePapersCount} copies offertes`,
                    },
                    {
                        title: 'Arsenal anti-triche',
                        description:
                            "Vos élèves ne pourront ni copier-coller de texte lors du passage de l'examen, ni changer de fenêtre sans que vous ne soyez averti",
                        value: 'Inclus',
                    },
                    {
                        title: 'Temps de réponse du support',
                        description:
                            "Une équipe est présente pour répondre à toutes vos questions concernant l'utilisation de la plateforme",
                        value: 'Moins de 72 heures ouvrées',
                    },
                ];
            case 'PRO':
                return [
                    {
                        title: 'Nombre de copies corrigées offertes',
                        description:
                            'Ces copies vous seront offertes à la création du compte quel que soit le plan choisi',
                        value: `${props.freePapersCount} copies offertes`,
                    },
                    {
                        title: 'Arsenal anti-triche',
                        description:
                            "Vos élèves ne pourront ni copier-coller de texte lors du passage de l'examen, ni changer de fenêtre sans que vous ne soyez averti",
                        value: 'Inclus',
                    },
                    {
                        title: 'Temps de réponse du support',
                        description:
                            "Une équipe est présente pour répondre à toutes vos questions concernant l'utilisation de la plateforme",
                        value: 'Moins de 24 heures',
                    },
                ];
        }
    }
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
