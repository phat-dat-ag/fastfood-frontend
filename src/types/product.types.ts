export interface ProductCreateRequest {
  category_id: number;
  name: string;
  description: string;
  price: string;
  activated: boolean;
  productImageUrl: File | null;
}

export interface ProductUpdateRequest {
  id: number;
  name: string;
  description: string;
  activated: boolean;
  imageUrl: File | null;
}

export interface Product {
  categoryId: number;
  categoryName: string;
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
