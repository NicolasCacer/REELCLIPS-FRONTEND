// features/chats/services/chat.service.ts

import { apiClient, ApiClient } from "@/shared/services/api";
import type { MessagePayload } from "../model/message.types";

import type {
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationMessagesRequest,
  GetConversationMessagesResponse,
  GetUserConversationsResponse,
} from "../model/chat.types";

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
 * Necesitas confirmar este endpoint en Swagger.
 * Si no existe, el backend todavía NO permite listar chats reales.
 */
export async function getUserConversationsService(
  usuarioId: number
): Promise<GetUserConversationsResponse> {
  const queryString = ApiClient.buildQueryString({ usuarioId });

  return apiClient.get<GetUserConversationsResponse>(
    `/chat/conversaciones${queryString}`
  );
}

export async function getUserChatsService(
  usuarioId: number
): Promise<MessagePayload[]> {
  return apiClient.get<MessagePayload[]>(
    `/chat/conversaciones?usuarioId=${usuarioId}`
  );
}