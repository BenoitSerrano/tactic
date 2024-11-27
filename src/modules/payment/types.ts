const paymentSessionStatuses = ['pending', 'completed'] as const;
type paymentSessionStatusType = (typeof paymentSessionStatuses)[number];

export { paymentSessionStatuses };
export type { paymentSessionStatusType };
