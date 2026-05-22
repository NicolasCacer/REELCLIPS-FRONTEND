// features/chats/controllers/useChatsController.ts

"use client";

import { useState, useCallback, useEffect } from "react";
import { createConversationService } from "../services/chat.service";
import type { CreateConversationRequest } from "../model/chat.types";
import type { ConversacionInfo } from "@/shared/types/api.types";

interface UseChatsControllerProps {
  userId: number;
}

export function useChatsController({ userId }: UseChatsControllerProps) {
  const [conversations, setConversations] = useState<ConversacionInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // POST: Iniciar nueva conversación
  const handleCreateConversation = useCallback(
    async (destinatarioId: number) => {
      try {
        setIsLoading(true);
        setError("");
        setSuccess("");

        const request: CreateConversationRequest = {
          usuarioId: userId,
          destinatarioId,
        };

        const nuevaConversacion = await createConversationService(request);

        // Verificar si ya existe la conversación
        const existe = conversations.some((c) => c.id === nuevaConversacion.id);
        if (!existe) {
          setConversations((prev) => [nuevaConversacion, ...prev]);
        }

        setSuccess("Conversación iniciada.");
        return nuevaConversacion;
      } catch (err) {
        setError("No se pudo crear la conversación.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, conversations]
  );

  // Cargar conversaciones del usuario (simulado)
  // En una implementación real, habría un endpoint GET /api/chat/conversaciones
  const loadConversations = useCallback(() => {
    // Este sería un endpoint que falta en la spec: GET /api/chat/conversaciones/{usuarioId}
    // Por ahora solo inicializamos el estado
    setConversations([]);
  }, []);

  // Filtrar conversación por ID
  const findConversationById = useCallback(
    (conversationId: number): ConversacionInfo | undefined => {
      return conversations.find((c) => c.id === conversationId);
    },
    [conversations]
  );

  // Cargar conversaciones al montar
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    error,
    success,
    loadConversations,
    handleCreateConversation,
    findConversationById,
  };
}
