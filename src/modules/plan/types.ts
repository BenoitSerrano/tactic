const PLAN_NAMES = ['FREE', 'UNLIMITED'] as const;
type planNameType = (typeof PLAN_NAMES)[number];

export { PLAN_NAMES };
export type { planNameType };
