// features/publish/model/publish.types.ts

import type { ReelInfo } from "@/shared/types/api.types";

// Requests
export type PublishReelRequest = {
  usuarioId: number;
  video: File;
  descripcion?: string;
  duracionSegundos: number;
  tamanoMB: number;
  categoriaIds: number[];
};

export type EditReelRequest = {
  reelId: number;
  usuarioId: number;
  descripcion?: string;
  categoriaIds: number[];
};

export type DeleteReelRequest = {
  reelId: number;
  usuarioId: number;
};

// Responses
export type PublishReelResponse = ReelInfo;

export type EditReelResponse = ReelInfo;

// Local types
export type PublishState = {
  isPublishing: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  error: string | null;
  successMessage: string | null;
};

export type VideoMetadata = {
  duracionSegundos: number;
  tamanoMB: number;
  nombreArchivo: string;
};
