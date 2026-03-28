export interface Image {
  id: number;
  sectionType: string;
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
