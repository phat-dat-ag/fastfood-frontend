export interface ReviewImage {
  imageUrl: string;
}

export interface Review {
  userName: string;
  userAvatar: string;
  productId: number;
  id: number;
  rating: number;
  comment: string;
  reviewImages: ReviewImage[];
  createdAt: string;
}

export interface ReviewImageCreateRequest {
  imageFile: File;
  previewUrl?: string;
  name?: string;
}

export interface ReviewCreateRequest {
  productId: number;
  rating: number;
  comment: string;
  images: ReviewImageCreateRequest[];
}
