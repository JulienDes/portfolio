export interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}
