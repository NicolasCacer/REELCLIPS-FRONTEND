// features/publish/services/publish.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type {
  PublishReelRequest,
  PublishReelResponse,
  EditReelRequest,
  EditReelResponse,
  DeleteReelRequest,
} from "../model/publish.types";

/**
 * POST /api/reels
 * Publica un nuevo reel con video
 */
export async function publishReelService(
  data: PublishReelRequest
): Promise<PublishReelResponse> {
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

  return apiClient.postFormData<PublishReelResponse>("/reels", formData);
}

/**
 * PUT /api/reels/{reelId}
 * Edita la descripción y categorías de un reel (solo el propietario)
 */
export async function editReelService(
  data: EditReelRequest
): Promise<EditReelResponse> {
  const queryString = ApiClient.buildQueryString({
    usuarioId: data.usuarioId,
    descripcion: data.descripcion,
    categoriaIds: data.categoriaIds,
  });

  return apiClient.put<EditReelResponse>(
    `/reels/${data.reelId}${queryString}`
  );
}

/**
 * DELETE /api/reels/{reelId}
 * Marca el reel como ELIMINADO (solo el propietario)
 */
export async function deleteReelService(
  data: DeleteReelRequest
): Promise<void> {
  const queryString = ApiClient.buildQueryString({
    usuarioId: data.usuarioId,
  });

  return apiClient.delete<void>(`/reels/${data.reelId}${queryString}`);
}

export { ApiClient };
