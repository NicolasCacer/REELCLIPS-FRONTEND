// features/feed/services/feed.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type {
  GetFeedRequest,
  GetFeedResponse,
  GetAllCategoriesResponse,
  GetCategoryResponse,
  FilterCategoriesResponse,
} from "../model/feed.types";
import type { CategoriaInfo } from "@/shared/types/api.types";

/**
 * GET /api/feed
 * Retorna reels públicos paginados con posibilidad de filtrar por categorías
 */
export async function getFeedService(
  params: GetFeedRequest
): Promise<GetFeedResponse> {
  const queryString = ApiClient.buildQueryString({
    usuarioId: params.usuarioId,
    categorias: params.categorias,
    pagina: params.pagina ?? 0,
    seed: params.seed,
  });

  return apiClient.get<GetFeedResponse>(`/feed${queryString}`);
}

/**
 * GET /api/categorias
 * Retorna todas las categorías disponibles
 */
export async function getAllCategoriesService(): Promise<GetAllCategoriesResponse> {
  return apiClient.get<GetAllCategoriesResponse>("/categorias");
}

/**
 * GET /api/categorias/{id}
 * Retorna una categoría específica por su ID
 */
export async function getCategoryService(
  categoryId: number
): Promise<GetCategoryResponse> {
  return apiClient.get<GetCategoryResponse>(`/categorias/${categoryId}`);
}

/**
 * GET /api/categorias/filtrar
 * Filtra y retorna categorías que coincidan con los nombres indicados
 */
export async function filterCategoriesService(
  nombres: string[]
): Promise<FilterCategoriesResponse> {
  const queryString = ApiClient.buildQueryString({
    nombres,
  });

  return apiClient.get<FilterCategoriesResponse>(`/categorias/filtrar${queryString}`);
}

/**
 * POST /api/categorias
 * Crea una nueva categoría (solo administradores)
 */
export async function createCategoryService(
  nombre: string,
  descripcion: string
): Promise<CategoriaInfo> {
  return apiClient.postUrlEncoded<CategoriaInfo>(
    "/categorias",
    {
      nombre,
      descripcion,
    }
  );
}

/**
 * PUT /api/categorias/{id}
 * Edita una categoría existente (solo administradores)
 */
export async function updateCategoryService(
  categoryId: number,
  nombre: string,
  descripcion: string
): Promise<CategoriaInfo> {
  return apiClient.putUrlEncoded<CategoriaInfo>(
    `/categorias/${categoryId}`,
    {
      nombre,
      descripcion,
    }
  );
}

/**
 * DELETE /api/categorias/{id}
 * Elimina una categoría (solo administradores)
 */
export async function deleteCategoryService(categoryId: number): Promise<void> {
  return apiClient.delete<void>(`/categorias/${categoryId}`);
}

export { ApiClient };
