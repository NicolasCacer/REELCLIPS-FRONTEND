// features/profile/model/profile.types.ts

import type { UsuarioInfo, PerfilInfo, ReelInfo } from "@/shared/types/api.types";

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

export type GetProfileReelsRequest = {
  canalId: number;
};

// Responses
export type GetProfileResponse = PerfilInfo;

export type UpdateProfileResponse = UsuarioInfo;

export type UploadProfilePhotoResponse = UsuarioInfo;

export type ChangeUsernameResponse = UsuarioInfo;

export type GetProfileReelsResponse = ReelInfo[];

// Local types
export type UserProfile = PerfilInfo;

export type CurrentUser = UsuarioInfo;

export type ProfileState = {
  perfil: PerfilInfo | null;
  usuarioActual: UsuarioInfo | null;
  loading: boolean;
  error: string | null;
};
