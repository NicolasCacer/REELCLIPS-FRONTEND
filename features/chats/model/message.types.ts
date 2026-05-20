// features/chats/model/message.types.ts

import type { MensajeInfo, TipoMensaje } from "@/shared/types/api.types";

// Alias para mayor claridad
export type Message = MensajeInfo;

export type MessageType = TipoMensaje;

export type MessagePayload = {
  id: number;
  conversacionId: number;
  remitenteId: number;
  contenido: string;
  tipoContenido: TipoMensaje;
  reelReferidoId: number | null;
  fechaEnvio: string;
};
