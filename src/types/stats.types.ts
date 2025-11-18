export interface UserStats {
  totalStaff: number;
  totalActivatedStaff: number;
  totalUser: number;
  totalActivatedUser: number;
  staffJoinedThisMonth: number;
  userJoinedThisMonth: number;
}

export interface OrderStats {
  pendingOrderAmount: number;
  confirmedOrderAmount: number;
  deliveringOrderAmount: number;
  deliveredOrderAmount: number;
  cancelledOrderAmount: number;

  cashOnDeliveryOrderAmount: number;
  bankTransferOrderAmount: number;

  discountedOrderAmount: number;

  cashOnDeliveryRevenue: number;
  bankTransferRevenue: number;
  totalRevenue: number;
}

export interface CategoryStats {
  name: string;
  totalRevenue: number;
  totalQuantitySold: number;
}

export interface ProductStats {
  name: string;
  totalRevenue: number;
  totalQuantitySold: number;
}

export interface TopicStats {
  id: number;
  name: string;
  totalQuizzesPlayed: number;
  totalPromotionsReceived: number;
}

export interface TopicDifficultyStats {
  id: number;
  name: string;
  totalQuizzesPlayed: number;
  totalPromotionsReceived: number;
  avgDurationSeconds: number;
}
