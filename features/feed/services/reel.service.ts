// features/feed/services/reel.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type {
  CreateReelRequest,
  CreateReelResponse,
  GetReelResponse,
  UpdateReelRequest,
  UpdateReelResponse,
  GetReelStreamResponse,
  GetCanalReelsResponse,
} from "../model/reel.types";
import type { ReelInfo } from "@/shared/types/api.types";

/**
 * POST /api/reels
 * Publica un nuevo reel con video
 */
export async function createReelService(
  data: CreateReelRequest
): Promise<CreateReelResponse> {
  const formData = new FormData();
  formData.append("usuarioId", String(data.usuarioId));
  formData.append("video", data.video);

  if (data.descripcion) {
    formData.append("descripcion", data.descripcion);
  }

  formData.append("duracionSegundos", String(data.duracionSegundos));
  formData.append("tamanoMB", String(data.tamanoMB));

  data.categoriaIds.forEach((id) => {
    formData.append("categoriaIds", String(id));
  });

  return apiClient.postFormData<CreateReelResponse>("/reels", formData);
}

/**
 * GET /api/reels
 * Lista todos los reels públicos con estado ACTIVO
 */
export async function getAllReelsService(): Promise<ReelInfo[]> {
  return apiClient.get<ReelInfo[]>("/reels");
}

/**
 * GET /api/reels/{id}
 * Obtiene los datos completos de un reel específico
 */
export async function getReelService(reelId: number): Promise<GetReelResponse> {
  return apiClient.get<GetReelResponse>(`/reels/${reelId}`);
}

/**
 * PUT /api/reels/{reelId}
 * Edita la descripción y categorías de un reel (solo el propietario)
 */
export async function updateReelService(
  reelId: number,
  data: UpdateReelRequest
): Promise<UpdateReelResponse> {
  return apiClient.putUrlEncoded<UpdateReelResponse>(
    `/reels/${reelId}`,
    {
      usuarioId: data.usuarioId,
      descripcion: data.descripcion,
      categoriaIds: data.categoriaIds,
    }
  );
}

/**
 * DELETE /api/reels/{reelId}
 * Marca el reel como ELIMINADO (solo el propietario)
 */
export async function deleteReelService(
  reelId: number,
  usuarioId: number
): Promise<void> {
  return apiClient.deleteUrlEncoded<void>(
    `/reels/${reelId}`,
    { usuarioId }
  );
}

/**
 * GET /api/reels/{reelId}/stream
 * Obtiene el stream de video con verificación de permisos
 */
export async function getReelStreamService(
  reelId: number,
  usuarioId: number
): Promise<GetReelStreamResponse> {
  const queryString = ApiClient.buildQueryString({
    usuarioId,
  });

  return apiClient.get<GetReelStreamResponse>(
    `/reels/${reelId}/stream${queryString}`
  );
}

/**
 * GET /api/reels/canal/{canalId}
 * Lista todos los reels publicados en un canal específico
 */
export async function getCanalReelsService(
  canalId: number
): Promise<GetCanalReelsResponse> {
  return apiClient.get<GetCanalReelsResponse>(`/reels/canal/${canalId}`);
}

export { ApiClient };
