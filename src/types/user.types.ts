export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  birthday: string;
  avatarUrl: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  activated: boolean;
  delete: boolean;
}

export interface UserResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  users: User[];
}

export interface EidtUserRequest {
  name: string;
  email: string;
  birthdayString: string;
}

export interface ChangePasswordRequest {
  password: string;
  newPassword: string;
}
