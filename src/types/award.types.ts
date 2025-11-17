export interface AwardCreateRequest {
  type: string;
  minValue: number;
  maxValue: number;
  quantity: number;
  maxDiscountAmount: number;
  minSpendAmount: number;
  isActivated: boolean;
}

export interface Award {
  id: number;
  type: string;
  minValue: string;
  maxValue: string;
  usedQuantity: number;
  quantity: number;
  maxDiscountAmount: string;
  minSpendAmount: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AwardResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  awards: Award[];
}
