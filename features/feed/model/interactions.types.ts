// features/feed/model/interactions.types.ts

import type { InteraccionInfo, ComentarioDetalle, TipoInteraccion } from "@/shared/types/api.types";

// Requests
export type AddLikeRequest = {
  usuarioId: number;
  reelId: number;
};

export type RemoveLikeRequest = {
  usuarioId: number;
  reelId: number;
};

export type AddCommentRequest = {
  usuarioId: number;
  reelId: number;
  contenido: string;
};

export type DeleteCommentRequest = {
  comentarioId: number;
  usuarioId: number;
};

export type GetCommentsRequest = {
  reelId: number;
};

// Responses
export type AddLikeResponse = InteraccionInfo;

export type RemoveLikeResponse = void;

export type AddCommentResponse = InteraccionInfo;

export type DeleteCommentResponse = void;

export type GetCommentsResponse = ComentarioDetalle[];

// Local types
export type Like = InteraccionInfo;

export type Comment = ComentarioDetalle;

export type InteractionState = {
  likes: Map<number, boolean>; // reelId -> hasLiked
  comments: Map<number, Comment[]>; // reelId -> comments
  loading: boolean;
  error: string | null;
};
