// features/chats/model/chat.types.ts

import type {
  ConversacionInfo,
  MensajeInfo,
  TipoMensaje,
} from "@/shared/types/api.types";

export type CreateConversationRequest = {
  usuarioId: number;
  destinatarioId: number;
};


export type GetConversationMessagesRequest = {
  conversacionId: number;
  usuarioId: number;
};

export type SendMessageRequest = {
  conversacionId: number;
  remitenteId: number;
  contenido: string;
  tipoContenido: TipoMensaje;
  reelReferidoId?: number | null;
};

export type ChatPreview = {
  conversacionId: number;
  ultimoMensaje: string;
  fechaUltimoMensaje: string;
  remitenteId: number;
};

export type IncomingMessageResponse = MensajeInfo;

export type CreateConversationResponse = ConversacionInfo;
export type GetConversationMessagesResponse = MensajeInfo[];
export type GetUserConversationsResponse = ConversacionInfo[];