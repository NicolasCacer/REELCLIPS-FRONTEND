// src/features/feed-comments/services/comments.service.ts

import { apiClient } from "@/shared/services/api";

import { getProfileService } from "@/features/profile/services/profile.service";

import type {
  PerfilInfo,
} from "@/shared/types/api.types";

import type {
  GetCommentsRequest,
  GetCommentsResponse,
  AddCommentRequest,
  AddCommentResponse,
  CommentProfileMap,
} from "../model/comments.types";

/**
 * GET /api/interacciones/comentarios
 * Obtiene comentarios de un reel
 */
export async function getCommentsByReelService(
  data: GetCommentsRequest
): Promise<GetCommentsResponse> {
  return apiClient.get<GetCommentsResponse>(
    `/interacciones/comentarios?reelId=${data.reelId}`
  );
}

/**
 * POST /api/interacciones/comentarios
 * Crear comentario
 */
export async function addCommentByReelService(
  data: AddCommentRequest
): Promise<AddCommentResponse> {
  return apiClient.postUrlEncoded<AddCommentResponse>(
    "/interacciones/comentarios",
    {
      usuarioId: data.usuarioId,
      reelId: data.reelId,
      contenido: data.contenido,
    }
  );
}

/**
 * Obtener perfiles de usuarios
 * usados dentro de comentarios
 */
export async function getCommentProfilesService(
  comentarios: {
    usuarioId: number;
  }[]
): Promise<CommentProfileMap> {
  const usuariosUnicos = [
    ...new Set(
      comentarios.map((c) => c.usuarioId)
    ),
  ];

  const perfiles = await Promise.all(
    usuariosUnicos.map(async (usuarioId) => {
      try {
        const perfil =
          await getProfileService({
            id: usuarioId,
          });

        return perfil;
      } catch {
        return null;
      }
    })
  );

  const mapa: Record<number, PerfilInfo> =
    {};

  perfiles.forEach((perfil) => {
    if (!perfil) return;

    mapa[perfil.id] = perfil;
  });

  return mapa;
}