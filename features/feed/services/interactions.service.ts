// features/feed/services/interactions.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type {
  AddLikeRequest,
  AddLikeResponse,
  RemoveLikeRequest,
  AddCommentRequest,
  AddCommentResponse,
  DeleteCommentRequest,
  GetCommentsRequest,
  GetCommentsResponse,
} from "../model/interactions.types";

/**
 * POST /api/interacciones/like
 * Da un like a un reel (un usuario solo puede dar un like por reel)
 */
export async function addLikeService(
  data: AddLikeRequest
): Promise<AddLikeResponse> {
  return apiClient.postUrlEncoded<AddLikeResponse>(
    "/interacciones/like",
    {
      usuarioId: data.usuarioId,
      reelId: data.reelId,
    }
  );
}

/**
 * DELETE /api/interacciones/like
 * Elimina el like dado a un reel
 */
export async function removeLikeService(
  data: RemoveLikeRequest
): Promise<void> {
  return apiClient.deleteUrlEncoded<void>(
    "/interacciones/like",
    {
      usuarioId: data.usuarioId,
      reelId: data.reelId,
    }
  );
}

/**
 * POST /api/interacciones/comentario
 * Agrega un comentario público a un reel
 */
export async function addCommentService(
  data: AddCommentRequest
): Promise<AddCommentResponse> {
  return apiClient.postUrlEncoded<AddCommentResponse>(
    "/interacciones/comentario",
    {
      usuarioId: data.usuarioId,
      reelId: data.reelId,
      contenido: data.contenido,
    }
  );
}

/**
 * DELETE /api/interacciones/comentario/{comentarioId}
 * Elimina un comentario (solo el autor)
 */
export async function deleteCommentService(
  data: DeleteCommentRequest
): Promise<void> {
  return apiClient.deleteUrlEncoded<void>(
    `/interacciones/comentario/${data.comentarioId}`,
    {
      usuarioId: data.usuarioId,
    }
  );
}

/**
 * GET /api/interacciones/comentarios/{reelId}
 * Retorna todos los comentarios de un reel en orden cronológico
 */
export async function getCommentsService(
  data: GetCommentsRequest
): Promise<GetCommentsResponse> {
  return apiClient.get<GetCommentsResponse>(
    `/interacciones/comentarios/${data.reelId}`
  );
}

export { ApiClient };
