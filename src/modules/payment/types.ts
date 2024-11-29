const paymentSessionStatuses = ['pending', 'completed', 'expired'] as const;
type paymentSessionStatusType = (typeof paymentSessionStatuses)[number];

export { paymentSessionStatuses };
export type { paymentSessionStatusType };
