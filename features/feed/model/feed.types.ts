// features/feed/model/feed.types.ts

import type { FeedResponse, ReelInfo, CategoriaInfo } from "@/shared/types/api.types";

// Requests
export type GetFeedRequest = {
  usuarioId: number;
  categorias?: string[];
  pagina?: number;
};

export type GetCategoriesRequest = {
  nombres?: string[];
};

// Responses
export type GetFeedResponse = FeedResponse;

export type GetAllCategoriesResponse = CategoriaInfo[];

export type GetCategoryResponse = CategoriaInfo;

export type FilterCategoriesResponse = CategoriaInfo[];

// Local types
export type Category = CategoriaInfo;

export type FeedState = {
  reels: ReelInfo[];
  paginaActual: number;
  totalPaginas: number;
  totalElementos: number;
  hayMas: boolean;
  loading: boolean;
  error: string | null;
};
