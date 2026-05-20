// features/profile/model/profile.types.ts

import type { UsuarioInfo, PerfilInfo, EstadoCuenta } from "@/shared/types/api.types";

// Requests
export type GetProfileRequest = {
  id: number;
};

export type UpdateProfileRequest = {
  id: number;
  nombre: string;
  foto: string;
  descripcion: string;
};

export type UploadProfilePhotoRequest = {
  id: number;
  foto: File;
};

export type ChangeUsernameRequest = {
  id: number;
  nuevoUsername: string;
};

export type DeleteAccountRequest = {
  id: number;
};

// Responses
export type GetProfileResponse = PerfilInfo;

export type UpdateProfileResponse = UsuarioInfo;

export type UploadProfilePhotoResponse = UsuarioInfo;

export type ChangeUsernameResponse = UsuarioInfo;

// Local types
export type UserProfile = PerfilInfo;

export type CurrentUser = UsuarioInfo;

export type ProfileState = {
  perfil: PerfilInfo | null;
  usuarioActual: UsuarioInfo | null;
  loading: boolean;
  error: string | null;
};
