// features/chats/controllers/useChatsController.ts

"use client";

import { useCallback, useEffect, useState } from "react";

import {
  createConversationService,
  getPublicProfilesService,
  getUserConversationsService,
} from "../services/chat.service";

import { getProfileService } from "@/features/profile/services/profile.service";

import type {
  ChatPreview,
  ConversationInfoResponse,
} from "../model/chat.types";

import type { PerfilInfo } from "@/shared/types/api.types";

interface UseChatsControllerProps {
  userId?: number | null;
}

export function useChatsController({ userId }: UseChatsControllerProps) {
  const [conversations, setConversations] = useState<ChatPreview[]>([]);
  const [contacts, setContacts] = useState<PerfilInfo[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [loadingContacts, setLoadingContacts] = useState(false);

  const [error, setError] = useState("");
  const [contactsError, setContactsError] = useState("");

  const loadConversations = useCallback(async () => {
    if (!userId) return;

    try {
      setIsLoading(true);
      setError("");

      const conversationsResponse = await getUserConversationsService(userId);

      const formattedConversations = await Promise.all(
        conversationsResponse.map(
          async (
            conversation: ConversationInfoResponse
          ): Promise<ChatPreview> => {
            const otherUserId =
              conversation.usuario1Id === userId
                ? conversation.usuario2Id
                : conversation.usuario1Id;

            try {
              const profile = await getProfileService({
                id: otherUserId,
              });

              return {
                id: conversation.id,
                conversacionId: conversation.id,
                user:
                  profile.nombreVisualizacion ||
                  profile.username ||
                  "Usuario",
                photo: profile.fotoPerfil || null,
                usuario1Id: conversation.usuario1Id,
                usuario2Id: conversation.usuario2Id,
                fechaInicio: conversation.fechaInicio,
              };
            } catch {
              return {
                id: conversation.id,
                conversacionId: conversation.id,
                user: "Usuario",
                photo: null,
                usuario1Id: conversation.usuario1Id,
                usuario2Id: conversation.usuario2Id,
                fechaInicio: conversation.fechaInicio,
              };
            }
          }
        )
      );

      setConversations(formattedConversations);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las conversaciones.");
      setConversations([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  const loadContacts = useCallback(async () => {
    if (!userId) return;

    try {
      setLoadingContacts(true);
      setContactsError("");

      const response = await getPublicProfilesService(userId);

      setContacts(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error(err);
      setContactsError("No se pudieron cargar los contactos.");
      setContacts([]);
    } finally {
      setLoadingContacts(false);
    }
  }, [userId]);

  const startConversation = useCallback(
    async (destinatarioId: number) => {
      if (!userId) return null;

      try {
        setError("");

        const conversation = await createConversationService({
          usuarioId: userId,
          destinatarioId,
        });

        await loadConversations();

        return conversation;
      } catch (err) {
        console.error(err);
        setError("No se pudo iniciar la conversación.");
        return null;
      }
    },
    [userId, loadConversations]
  );

  useEffect(() => {
    if (!userId) return;

    void loadConversations();
    void loadContacts();
  }, [userId, loadConversations, loadContacts]);

  return {
    conversations,
    contacts,

    isLoading,
    loadingContacts,

    error,
    contactsError,

    loadConversations,
    loadContacts,
    startConversation,
  };
}