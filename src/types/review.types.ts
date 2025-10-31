export interface ReviewImage {
  imageUrl: string;
}

export interface Review {
  productId: number;
  id: number;
  rating: number;
  comment: string;
  reviewImages: ReviewImage[];
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
