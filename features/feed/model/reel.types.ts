// features/feed/model/reel.types.ts

import type { ReelInfo, VideoStream, EstadoReel } from "@/shared/types/api.types";

// Requests
export type CreateReelRequest = {
  usuarioId: number;
  video: File;
  descripcion?: string;
  duracionSegundos: number;
  tamanoMB: number;
  categoriaIds: number[];
};

export type UpdateReelRequest = {
  usuarioId: number;
  descripcion?: string;
  categoriaIds: number[];
};

// Responses
export type CreateReelResponse = ReelInfo;

export type GetReelResponse = ReelInfo;

export type UpdateReelResponse = ReelInfo;

export type GetReelStreamResponse = VideoStream;

export type GetCanalReelsResponse = ReelInfo[];

// Local types
export type Reel = ReelInfo;

export type ReelFilters = {
  categorias?: string[];
  estado?: EstadoReel;
};
