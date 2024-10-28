const USER_ROLES = ['teacher', 'admin'] as const;
type userRoleType = (typeof USER_ROLES)[number];

export { USER_ROLES };

export type { userRoleType };
