// src/features/feed-comments/controllers/useComments.ts
"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  EstadoReel,
  TipoInteraccion,
} from "@/shared/types/api.types";

import type {
  ComentarioDetalle,
} from "@/shared/types/api.types";

import type {
  CommentsState,
  UseCommentsParams,
  UseCommentsReturn,
} from "../model/comments.types";

import {
  addCommentByReelService,
  getCommentsByReelService,
  getCommentProfilesService,
} from "../services/comments.service";

const FALLBACK_COMMENTS: ComentarioDetalle[] =
  [
    {
      id: -1,
      tipo: TipoInteraccion.COMENTARIO,
      usuarioId: 11,
      reelId: -1,
      fecha: new Date().toISOString(),
      contenido:
        "Wow, me encanta este reel 🔥",
    },
    {
      id: -2,
      tipo: TipoInteraccion.COMENTARIO,
      usuarioId: 12,
      reelId: -1,
      fecha: new Date().toISOString(),
      contenido:
        "Necesitamos más contenido así.",
    },
  ];

export function useComments({
  reelId,
  usuarioId,
}: UseCommentsParams): UseCommentsReturn {
  const [state, setState] =
    useState<CommentsState>({
      comentarios: [],
      perfilesComentarios: {},

      loading: false,
      error: null,
    });

  /**
   * CARGAR
   */
  const refrescarComentarios =
    useCallback(async () => {
      if (!reelId) return;

      /**
       * Reel fallback
       */
      if (reelId < 0) {
        setState((prev) => ({
          ...prev,
          comentarios:
            FALLBACK_COMMENTS,
        }));

        return;
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const data =
          await getCommentsByReelService({
            reelId,
          });

        const comentarios =
          Array.isArray(data)
            ? data
            : [];

        /**
         * FALLBACK TEMPORAL
         * backend aún no manda contenido
         */
        const normalizados =
          comentarios.map(
            (comentario, index) => ({
              ...comentario,
              contenido:
                comentario.contenido?.trim() ||
                `Comentario ${
                  index + 1
                }`,
            })
          );

        const perfiles =
          await getCommentProfilesService(
            normalizados
          );

        setState({
          comentarios:
            normalizados,
          perfilesComentarios:
            perfiles,

          loading: false,
          error: null,
        });
      } catch {
        setState((prev) => ({
          ...prev,
          comentarios: [],
          loading: false,
          error:
            "No se pudieron cargar los comentarios.",
        }));
      }
    }, [reelId]);

  /**
   * AUTO LOAD
   */
  useEffect(() => {
    void refrescarComentarios();
  }, [refrescarComentarios]);

  /**
   * AGREGAR
   */
  const agregarComentario =
    useCallback(
      async (
        contenido: string
      ) => {
        const texto =
          contenido.trim();

        if (
          !texto ||
          !reelId ||
          !usuarioId
        ) {
          return;
        }

        /**
         * Optimista
         */
        const optimista: ComentarioDetalle =
          {
            id:
              Date.now() * -1,

            tipo:
              TipoInteraccion.COMENTARIO,

            usuarioId,

            reelId,

            fecha:
              new Date().toISOString(),

            contenido: texto,
          };

        setState((prev) => ({
          ...prev,
          comentarios: [
            optimista,
            ...prev.comentarios,
          ],
        }));

        /**
         * Reel temporal
         */
        if (reelId < 0) return;

        try {
          await addCommentByReelService(
            {
              usuarioId,
              reelId,
              contenido: texto,
            }
          );

          /**
           * Re-sync real
           */
          await refrescarComentarios();
        } catch {
          /**
           * Rollback
           */
          setState((prev) => ({
            ...prev,
            comentarios:
              prev.comentarios.filter(
                (c) =>
                  c.id !==
                  optimista.id
              ),
          }));
        }
      },
      [
        reelId,
        usuarioId,
        refrescarComentarios,
      ]
    );

  return {
    comentarios:
      state.comentarios,

    perfilesComentarios:
      state.perfilesComentarios,

    loading: state.loading,

    agregarComentario,

    refrescarComentarios,
  };
}