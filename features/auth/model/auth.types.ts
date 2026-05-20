// features/auth/model/auth.types.ts

import type { UsuarioInfo } from "@/shared/types/api.types";

// Requests
export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  username: string;
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  nombre: string;
  foto: string;
  descripcion: string;
};

export type ChangeUsernameRequest = {
  nuevoUsername: string;
};

// Responses
export type AuthResponse = UsuarioInfo;

export type LoginResponse = UsuarioInfo;

export type RegisterResponse = UsuarioInfo;

export type UpdateProfileResponse = UsuarioInfo;

export type ChangeUsernameResponse = UsuarioInfo;