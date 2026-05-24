// src/features/feed/model/comments.types.ts

import type {
  ComentarioDetalle,
  PerfilInfo,
} from "@/shared/types/api.types";

/**
 * Requests
 */

export type GetCommentsRequest = {
  reelId: number;
};

export type AddCommentRequest = {
  usuarioId: number;
  reelId: number;
  contenido: string;
};

/**
 * Responses
 */

export type GetCommentsResponse =
  ComentarioDetalle[];

export type AddCommentResponse =
  ComentarioDetalle;

/**
 * Local state
 */

export type CommentProfileMap = Record<
  number,
  PerfilInfo
>;

export type CommentsState = {
  comentarios: ComentarioDetalle[];
  perfilesComentarios: CommentProfileMap;

  loading: boolean;
  error: string | null;
};

export type UseCommentsParams = {
  reelId: number | null;
  usuarioId: number | null;
};

export type UseCommentsReturn = {
  comentarios: ComentarioDetalle[];

  perfilesComentarios: CommentProfileMap;

  loading: boolean;

  agregarComentario: (
    contenido: string
  ) => Promise<void>;

  refrescarComentarios: () => Promise<void>;
};