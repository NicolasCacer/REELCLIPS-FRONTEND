// features/auth/services/auth.service.ts

import { ApiClient, apiClient } from "@/shared/services/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangeUsernameRequest,
  ChangeUsernameResponse,
} from "../model/auth.types";
import type { PerfilInfo, UsuarioInfo } from "@/shared/types/api.types";

/**
 * POST /api/usuarios/login
 * Autentica al usuario con sus credenciales
 */
export async function loginService(data: LoginRequest): Promise<LoginResponse> {
  const queryString = ApiClient.buildQueryString({
    email: data.email,
    password: data.password,
  });

  return apiClient.post<LoginResponse>(`/usuarios/login${queryString}`);
}

/**
 * POST /api/usuarios/registro
 * Registra un nuevo usuario en la plataforma
 */
export async function registerService(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const queryString = ApiClient.buildQueryString({
    username: data.username,
    email: data.email,
    password: data.password,
  });

  return apiClient.post<RegisterResponse>(`/usuarios/registro${queryString}`);
}

/**
 * GET /api/usuarios/{id}/perfil
 * Obtiene el perfil público de un usuario
 */
export async function getProfileService(
  userId: number
): Promise<PerfilInfo> {
  return apiClient.get<PerfilInfo>(`/usuarios/${userId}/perfil`);
}

/**
 * PUT /api/usuarios/{id}/perfil
 * Actualiza el perfil del usuario
 */
export async function updateProfileService(
  userId: number,
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const queryString = ApiClient.buildQueryString({
    nombre: data.nombre,
    foto: data.foto,
    descripcion: data.descripcion,
  });

  return apiClient.put<UpdateProfileResponse>(
    `/usuarios/${userId}/perfil${queryString}`
  );
}

/**
 * POST /api/usuarios/{id}/foto
 * Sube una imagen de perfil a Supabase Storage
 */
export async function uploadProfilePhotoService(
  userId: number,
  foto: File
): Promise<UsuarioInfo> {
  const formData = new FormData();
  formData.append("foto", foto);

  return apiClient.postFormData<UsuarioInfo>(
    `/usuarios/${userId}/foto`,
    formData
  );
}

/**
 * PATCH /api/usuarios/{id}/username
 * Cambia el nombre de usuario (máximo una vez cada 30 días)
 */
export async function changeUsernameService(
  userId: number,
  data: ChangeUsernameRequest
): Promise<ChangeUsernameResponse> {
  const queryString = ApiClient.buildQueryString({
    nuevoUsername: data.nuevoUsername,
  });

  return apiClient.patch<ChangeUsernameResponse>(
    `/usuarios/${userId}/username${queryString}`
  );
}

/**
 * DELETE /api/usuarios/{id}
 * Desactiva la cuenta del usuario
 */
export async function deleteAccountService(userId: number): Promise<void> {
  return apiClient.delete<void>(`/usuarios/${userId}`);
}

export { ApiClient } from "@/shared/services/api";