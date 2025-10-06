export interface User {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  avatarUrl: string | null;
  role: string;
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
