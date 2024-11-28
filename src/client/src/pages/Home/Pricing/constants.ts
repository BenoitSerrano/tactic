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

export { PRICING_PLANS, PRICING_PLAN_NAMES };
export type { pricingPlanNameType, pricingPlanType, planOptionType };
