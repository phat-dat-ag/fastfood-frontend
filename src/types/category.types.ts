export interface CategoryCreateRequest {
  name: string;
  description: string;
  activated: string;
  imageUrl: File | null;
}

export interface CategoryUpdateRequest {
  id: number;
  name: string;
  description: string;
  activated: string;
  imageUrl: File | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  activated: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPageResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  categories: Category[];
}

export interface CategoryDisplayResponse {
  displayableCategories: Category[];
}
