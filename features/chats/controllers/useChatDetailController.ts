// features/chats/controllers/useChatDetailController.ts

"use client";

import { useState, useCallback, useEffect } from "react";
import { getConversationMessagesService } from "../services/chat.service";
import type { GetConversationMessagesRequest } from "../model/chat.types";
import type { MensajeInfo } from "@/shared/types/api.types";

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
  const [success, setSuccess] = useState("");

  // GET: Cargar mensajes de la conversación
  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const request: GetConversationMessagesRequest = {
        conversacionId,
        usuarioId,
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

  // Simulación: POST para enviar mensaje
  // Nota: El endpoint POST /api/chat/conversacion/{conversacionId}/mensaje no aparece en la spec
  // pero sería necesario para una funcionalidad completa
  const handleSendMessage = useCallback(
    async (contenido: string) => {
      try {
        setError("");
        setSuccess("");

        // Validar contenido
        if (!contenido.trim()) {
          setError("El mensaje no puede estar vacío.");
          return;
        }

        // Aquí iría la llamada al servicio para enviar el mensaje
        // const newMessage = await sendMessageService({ ... });
        // setMensajes((prev) => [...prev, newMessage]);
        // setSuccess("Mensaje enviado.");

        console.log("Mensaje a enviar:", contenido);
        // Por ahora solo logueamos, en una implementación real enviaremos al backend
      } catch (err) {
        setError("No se pudo enviar el mensaje.");
        console.error(err);
      }
    },
    []
  );

  // Cargar mensajes al montar o cuando cambia la conversación
  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    mensajes,
    isLoading,
    error,
    success,
    loadMessages,
    handleSendMessage,
  };
}
