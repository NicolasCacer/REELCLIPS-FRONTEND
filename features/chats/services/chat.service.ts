// features/chats/services/chat.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";

import type { PerfilInfo } from "@/shared/types/api.types";

import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationMessagesRequest,
  GetConversationMessagesResponse,
  GetUserConversationsResponse,
} from "../model/chat.types";

/**
 * POST /api/chat/conversacion
 * Inicia una nueva conversación entre dos usuarios o reutiliza una existente
 */
export async function createConversationService(
  data: CreateConversationRequest
): Promise<CreateConversationResponse> {
  return apiClient.postUrlEncoded<CreateConversationResponse>(
    `/chat/conversacion`,
    {
      usuarioId: data.usuarioId,
      destinatarioId: data.destinatarioId,
    }
  );
}

/**
 * GET /api/chat/conversacion/{conversacionId}/mensajes
 * Retorna todos los mensajes de una conversación
 */
export async function getConversationMessagesService(
  data: GetConversationMessagesRequest
): Promise<GetConversationMessagesResponse> {
  const queryString = ApiClient.buildQueryString({
    usuarioId: data.usuarioId,
  });

  return apiClient.get<GetConversationMessagesResponse>(
    `/chat/conversacion/${data.conversacionId}/mensajes${queryString}`
  );
}

/**
 * GET /api/chat/conversaciones?usuarioId={usuarioId}
 * Retorna todas las conversaciones donde participa el usuario
 */
export async function getUserConversationsService(
  usuarioId: number
): Promise<GetUserConversationsResponse> {
  const queryString = ApiClient.buildQueryString({
    usuarioId,
  });

  return apiClient.get<GetUserConversationsResponse>(
    `/chat/conversaciones${queryString}`
  );
}

/**
 * GET /api/usuarios/perfiles-publicos?usuarioId={usuarioId}
 * Retorna usuarios activos excluyendo al usuario que consulta
 */
export async function getPublicProfilesService(
  usuarioId: number
): Promise<PerfilInfo[]> {
  const queryString = ApiClient.buildQueryString({
    usuarioId,
  });

  return apiClient.get<PerfilInfo[]>(
    `/usuarios/perfiles-publicos${queryString}`
  );
}

export { ApiClient };