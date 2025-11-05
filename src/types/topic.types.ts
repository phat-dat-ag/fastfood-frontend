export interface TopicCreateRequest {
  name: string;
  description: string;
  isActivated: boolean;
}

export interface TopicUpdateRequest {
  id: number;
  name: string;
  description: string;
  isActivated: boolean;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  description: string;
  activated: boolean;
  createdAt: string;
  updatedAt: string;
}
