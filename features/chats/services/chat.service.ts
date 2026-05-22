// features/chats/services/chat.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";

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
  const queryString = ApiClient.buildQueryString({
    usuarioId: data.usuarioId,
    destinatarioId: data.destinatarioId,
  });

  return apiClient.post<CreateConversationResponse>(
    `/chat/conversacion${queryString}`
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

export { ApiClient };