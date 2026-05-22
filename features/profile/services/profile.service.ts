// features/profile/services/profile.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type {
  GetProfileRequest,
  GetProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse,
  UploadProfilePhotoRequest,
  UploadProfilePhotoResponse,
  ChangeUsernameRequest,
  ChangeUsernameResponse,
  DeleteAccountRequest,
} from "../model/profile.types";

/**
 * GET /api/usuarios/{id}/perfil
 * Obtiene el perfil público de un usuario
 */
export async function getProfileService(
  data: GetProfileRequest
): Promise<GetProfileResponse> {
  return apiClient.get<GetProfileResponse>(`/usuarios/${data.id}/perfil`);
}

/**
 * PUT /api/usuarios/{id}/perfil
 * Actualiza el perfil del usuario
 */
export async function updateProfileService(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiClient.putUrlEncoded<UpdateProfileResponse>(
    `/usuarios/${data.id}/perfil`,
    {
      nombre: data.nombre,
      foto: data.foto,
      descripcion: data.descripcion,
    }
  );
}

/**
 * POST /api/usuarios/{id}/foto
 * Sube una imagen de perfil a Supabase Storage
 */
export async function uploadProfilePhotoService(
  data: UploadProfilePhotoRequest
): Promise<UploadProfilePhotoResponse> {
  const formData = new FormData();
  formData.append("foto", data.foto);

  return apiClient.postFormData<UploadProfilePhotoResponse>(
    `/usuarios/${data.id}/foto`,
    formData
  );
}

/**
 * PATCH /api/usuarios/{id}/username
 * Cambia el nombre de usuario (máximo una vez cada 30 días)
 */
export async function changeUsernameService(
  data: ChangeUsernameRequest
): Promise<ChangeUsernameResponse> {
  return apiClient.patchUrlEncoded<ChangeUsernameResponse>(
    `/usuarios/${data.id}/username`,
    {
      nuevoUsername: data.nuevoUsername,
    }
  );
}

/**
 * DELETE /api/usuarios/{id}
 * Desactiva la cuenta del usuario
 */
export async function deleteAccountService(
  data: DeleteAccountRequest
): Promise<void> {
  return apiClient.delete<void>(`/usuarios/${data.id}`);
}

export { ApiClient };
