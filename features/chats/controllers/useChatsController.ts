// features/chats/controllers/useChatsController.ts
import { useCallback, useEffect, useState } from "react";

import { getUserChatsService } from "../services/chat.service";

import type { ChatPreview } from "../model/chat.types";

interface UseChatsControllerProps {
  userId: number;
}

export function useChatsController({
  userId,
}: UseChatsControllerProps) {
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);

      const messages = await getUserChatsService(userId);

      /**
       * Agrupar por conversación
       */
      const map = new Map<number, ChatPreview>();

      messages.forEach((message) => {
        map.set(message.conversacionId, {
          conversacionId: message.conversacionId,
          ultimoMensaje: message.contenido,
          fechaUltimoMensaje: message.fechaEnvio,
          remitenteId: message.remitenteId,
        });
      });

      setConversations(Array.from(map.values()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    loadConversations,
  };
}