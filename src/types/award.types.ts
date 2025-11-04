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
