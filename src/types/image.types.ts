export interface Image {
  id: number;
  url: string;
  alternativeText: string;
  createdAt: string;
  updatedAt: string;
}

export interface AboutUsPageImage {
  carouselImages: Image[];
  showcaseImages: Image[];
  missionImages: Image[];
}

export interface ChallengeIntroductionImage {
  carouselImages: Image[];
}

export interface ImageCreateRequest {
  imageFile: File;
  alternativeText: string;
  pageType: string;
  sectionType: string;
}

export interface ItemPromotionImage {
  name: string;
  url: string;
  type: string;
  value: number;
  code: string;
  startAt: string;
  endAt: string;
}

export interface ItemPromotionImageResponse {
  categoryPromotions: ItemPromotionImage[];
  productPromotions: ItemPromotionImage[];
}
