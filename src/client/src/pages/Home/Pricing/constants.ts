const PRICING_PLAN_NAMES = ['FREE', 'PRO'] as const;
type pricingPlanType = { title: string; description: string; name: pricingPlanNameType };
type pricingPlanNameType = (typeof PRICING_PLAN_NAMES)[number];

const PRICING_PLANS: Record<pricingPlanNameType, pricingPlanType> = {
    FREE: { name: 'FREE', title: 'Gratuit', description: 'Découvrez Tactic' },
    PRO: {
        name: 'PRO',
        title: 'Professionnel',
        description: 'Parfait pour les professeurs de langue',
    },
};

type planOptionType = { title: string; description: string; value: string };
const PRICING_PLAN_OPTIONS: Record<pricingPlanNameType, planOptionType[]> = {
    FREE: [
        {
            title: 'Nombre de copies corrigées offertes',
            description:
                'Ces copies vous seront offertes à la création du compte quel que soit le plan choisi',
            value: '30 copies offertes',
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
    ],
    PRO: [
        {
            title: 'Nombre de copies corrigées offertes',
            description:
                'Ces copies vous seront offertes à la création du compte quel que soit le plan choisi',
            value: '30 copies offertes',
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
    ],
};

const PRO_PRICES = [
    { attempts: 20, price: 16 },
    { attempts: 50, price: 30 },
    { attempts: 100, price: 50 },
    { attempts: 200, price: 80 },
];

export { PRICING_PLANS, PRICING_PLAN_NAMES, PRO_PRICES, PRICING_PLAN_OPTIONS };
export type { pricingPlanNameType, pricingPlanType };
