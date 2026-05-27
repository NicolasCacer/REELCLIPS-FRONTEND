"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getProfileReelsService,
  getProfileService,
} from "@/features/profile/services/profile.service";

import { useAuth } from "@/features/auth/controllers/authContext";
import { createConversationService } from "@/features/chats/services/chat.service";

import { EstadoReel } from "@/shared/types/api.types";

import type {
  PublicProfileModalState,
  UsePublicProfileModalReturn,
} from "@/features/feed/model/publicProfile.types";

const INITIAL_STATE: PublicProfileModalState = {
  perfil: null,
  totalPublicaciones: 0,
  usuarioId: null,
  loading: false,
  creandoConversacion: false,
  error: null,
  mensajeError: null,
  open: false,
};

export function usePublicProfileModal(): UsePublicProfileModalReturn {
  const router = useRouter();
  const { user } = useAuth();

  const [state, setState] =
    useState<PublicProfileModalState>(INITIAL_STATE);

  const cerrarPerfil = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  const abrirPerfil = useCallback(async (usuarioId: number) => {
    if (!usuarioId || usuarioId <= 0) {
      return;
    }

    setState({
      perfil: null,
      totalPublicaciones: 0,
      usuarioId,
      loading: true,
      creandoConversacion: false,
      error: null,
      mensajeError: null,
      open: true,
    });

    try {
      const [perfil, reels] = await Promise.all([
        getProfileService({ id: usuarioId }),
        getProfileReelsService({ canalId: usuarioId }).catch(() => []),
      ]);

      const totalPublicaciones = Array.isArray(reels)
        ? reels.filter((reel) => reel.estado !== EstadoReel.ELIMINADO).length
        : 0;

      setState({
        perfil,
        totalPublicaciones,
        usuarioId,
        loading: false,
        creandoConversacion: false,
        error: null,
        mensajeError: null,
        open: true,
      });
    } catch {
      setState({
        perfil: null,
        totalPublicaciones: 0,
        usuarioId,
        loading: false,
        creandoConversacion: false,
        error: "No se pudo cargar la informacion publica del perfil.",
        mensajeError: null,
        open: true,
      });
    }
  }, []);

  const enviarMensaje = useCallback(async () => {
    const usuarioActualId = user?.id;
    const destinatarioId = state.usuarioId;

    if (!usuarioActualId) {
      setState((prev) => ({
        ...prev,
        mensajeError: "Debes iniciar sesion para enviar mensajes.",
      }));
      return;
    }

    if (!destinatarioId) {
      setState((prev) => ({
        ...prev,
        mensajeError: "No se encontro el perfil destino.",
      }));
      return;
    }

    if (usuarioActualId === destinatarioId) {
      setState((prev) => ({
        ...prev,
        mensajeError: "No puedes abrir un chat contigo mismo.",
      }));
      return;
    }

    setState((prev) => ({
      ...prev,
      creandoConversacion: true,
      mensajeError: null,
    }));

    try {
      const conversacion = await createConversationService({
        usuarioId: usuarioActualId,
        destinatarioId,
      });

      if (conversacion?.id) {
        router.push(`/chats/${conversacion.id}`);
        setState(INITIAL_STATE);
        return;
      }

      setState((prev) => ({
        ...prev,
        creandoConversacion: false,
        mensajeError: "No se pudo abrir la conversacion.",
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        creandoConversacion: false,
        mensajeError: "No se pudo iniciar la conversacion.",
      }));
    }
  }, [router, state.usuarioId, user?.id]);

  return {
    ...state,
    abrirPerfil,
    cerrarPerfil,
    enviarMensaje,
  };
}
