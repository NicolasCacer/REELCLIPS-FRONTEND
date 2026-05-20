// features/chats/model/chat.types.ts

import type { ConversacionInfo, MensajeInfo, TipoMensaje } from "@/shared/types/api.types";

// Requests
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
  reelReferidoId?: number;
};

// Responses
export type CreateConversationResponse = ConversacionInfo;

export type GetConversationMessagesResponse = MensajeInfo[];

export type SendMessageResponse = MensajeInfo;

// Local types
export type Conversacion = ConversacionInfo;

export type Mensaje = MensajeInfo;

export type ChatState = {
  conversaciones: Conversacion[];
  conversacionActual: Conversacion | null;
  mensajes: Mensaje[];
  loading: boolean;
  error: string | null;
};
