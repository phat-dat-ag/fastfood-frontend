export const USER_QUERY = {
  USER: "USER",
  STAFF: "STAFF",
} as const;

export type UserQueryType = (typeof USER_QUERY)[keyof typeof USER_QUERY];
