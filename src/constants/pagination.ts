export const PAGE_SIZE = {
  ACCOUNTS: {
    CUSTOMER: 5,
    STAFF: 5,
  },
  CATEGORY: 5,
  PRODUCT: 5,
  PROMOTION: {
    BY_CATEGORY: 5,
    BY_PRODUCT: 5,
    BY_ORDER: 5,
  },
  ORDERS: {
    ADMIN: 7,
    HISTORY: 5,
    TRACKING: 5,
    STAFF: 4,
  },
  REIVEWS: {
    ADMIN: 4,
  },
  TOPIC: 4,
  TOPIC_DIFFICULTY: 4,
  AWARD: 4,
  QUESTION: 4,
  QUIZ_FEEDBACK: 4,
} as const;
