export interface ProductCreateRequest {
  category_id: number;
  name: string;
  description: string;
  price: string;
  activated: boolean;
  productImageUrl: File | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  description: string;
  productImageUrl: string;
  activated: boolean;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
}
