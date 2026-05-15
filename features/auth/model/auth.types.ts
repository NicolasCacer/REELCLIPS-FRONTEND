// features/auth/model/auth.types.ts

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthUser = {
  id: string;
  name: string;
  username?: string;
  email: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type RegisterResponse = {
  user: AuthUser;
  token: string;
};