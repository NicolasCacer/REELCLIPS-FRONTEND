// features/chats/services/chatSocket.service.ts

import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import type { MensajeInfo } from "@/shared/types/api.types";
import type { SendMessageRequest } from "../model/chat.types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

const WS_BASE_URL = API_URL.replace(/\/api$/, "");

export function createChatSocketClient({
  usuarioId,
  onMessage,
  onError,
}: {
  usuarioId: number;
  onMessage: (message: MensajeInfo) => void;
  onError?: (error: unknown) => void;
}) {
  const client = new Client({
    webSocketFactory: () =>
      new SockJS(`${WS_BASE_URL}/ws-chat?usuarioId=${usuarioId}`),

    reconnectDelay: 3000,

    onConnect: () => {
      client.subscribe("/user/queue/mensajes", (frame) => {
        onMessage(JSON.parse(frame.body));
      });

      client.subscribe("/user/queue/errores", (frame) => {
        onError?.(frame.body);
      });
    },

    onStompError: (frame) => {
      onError?.(frame.body);
    },
  });

  return client;
}

export function publishChatMessage(
  client: Client,
  message: SendMessageRequest
) {
  client.publish({
    destination: "/app/chat.enviar",
    body: JSON.stringify(message),
  });
}