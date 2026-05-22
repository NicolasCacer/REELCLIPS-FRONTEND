// features/chats/controllers/useChatsController.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import { getUserConversationsService } from "../services/chat.service";

import { getProfileService } from "@/features/profile/services/profile.service";

import type {
  ChatPreview,
  ConversationInfoResponse,
} from "../model/chat.types";

interface UseChatsControllerProps {
  userId: number;
}

export function useChatsController({
  userId,
}: UseChatsControllerProps) {
  const [conversations, setConversations] = useState<
    ChatPreview[]
  >([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const loadConversations = useCallback(
    async () => {
      try {
        setIsLoading(true);
        setError("");

        /**
         * Conversaciones reales
         */
        const conversationsResponse =
          await getUserConversationsService(
            userId
          );

        /**
         * Obtener perfiles
         */
        const formattedConversations =
          await Promise.all(
            conversationsResponse.map(
              async (
                conversation: ConversationInfoResponse
              ): Promise<ChatPreview> => {
                const otherUserId =
                  conversation.usuario1Id ===
                  userId
                    ? conversation.usuario2Id
                    : conversation.usuario1Id;

                try {
                  const profile =
                    await getProfileService({
                      id: otherUserId,
                    });

                  return {
                    id: conversation.id,

                    conversacionId:
                      conversation.id,

                    user:
                      profile.nombreVisualizacion ||
                      profile.username ||
                      "Usuario",

                    photo:
                      profile.fotoPerfil ||
                      null,

                    usuario1Id:
                      conversation.usuario1Id,

                    usuario2Id:
                      conversation.usuario2Id,

                    fechaInicio:
                      conversation.fechaInicio,
                  };
                } catch {
                  /**
                   * Fallback si falla perfil
                   */
                  return {
                    id: conversation.id,

                    conversacionId:
                      conversation.id,

                    user: "Usuario",

                    photo: null,

                    usuario1Id:
                      conversation.usuario1Id,

                    usuario2Id:
                      conversation.usuario2Id,

                    fechaInicio:
                      conversation.fechaInicio,
                  };
                }
              }
            )
          );

        setConversations(
          formattedConversations
        );
      } catch (err) {
        console.error(err);

        setError(
          "No se pudieron cargar las conversaciones."
        );

        setConversations([]);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    isLoading,
    error,
    loadConversations,
  };
}