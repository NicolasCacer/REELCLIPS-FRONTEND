// features/chats/controllers/useChatDetailController.ts
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Client } from "@stomp/stompjs";
import { getConversationMessagesService } from "../services/chat.service";
import {
  createChatSocketClient,
  publishChatMessage,
} from "../services/chatSocket.service";
import type { GetConversationMessagesRequest } from "../model/chat.types";
import { MensajeInfo, TipoMensaje } from "@/shared/types/api.types";

interface UseChatDetailControllerProps {
  conversacionId: number;
  userId: number;
}

export function useChatDetailController({
  conversacionId,
  userId,
}: UseChatDetailControllerProps) {
  const [mensajes, setMensajes] = useState<MensajeInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const clientRef = useRef<Client | null>(null);

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const request: GetConversationMessagesRequest = {
        conversacionId,
        usuarioId: userId,
      };

      const messages = await getConversationMessagesService(request);
      setMensajes(messages);
    } catch (err) {
      setError("No se pudieron cargar los mensajes.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [conversacionId, userId]);

  const handleSendMessage = useCallback(
    async (contenido: string) => {
      const text = contenido.trim();

      if (!text) {
        setError("El mensaje no puede estar vacío.");
        return;
      }

      const client = clientRef.current;

      if (!client?.connected) {
        setError("El chat aún no está conectado.");
        return;
      }

      publishChatMessage(client, {
        conversacionId,
        remitenteId: userId,
        contenido: text,
        tipoContenido: TipoMensaje.TEXTO,
        reelReferidoId: null,
      });
    },
    [conversacionId, userId]
  );

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    const client = createChatSocketClient({
      usuarioId: userId,
      onMessage: (message) => {
        if (message.conversacionId !== conversacionId) return;

        setMensajes((prev) => {
          const exists = prev.some((m) => m.id === message.id);
          return exists ? prev : [...prev, message];
        });
      },
      onError: (err) => {
        console.error(err);
        setError("Ocurrió un error en el chat.");
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, [userId, conversacionId]);

  return {
    mensajes,
    isLoading,
    error,
    loadMessages,
    handleSendMessage,
  };
}