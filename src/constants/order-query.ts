export const ORDER_QUERY = {
  ACTIVE: "ACTIVE",
  HISTORY: "HISTORY",
  UNFINISHED: "UNFINISHED",
  ALL: "ALL",
} as const;

export type OrderQueryType = (typeof ORDER_QUERY)[keyof typeof ORDER_QUERY];
