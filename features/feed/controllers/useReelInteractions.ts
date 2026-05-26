// features/feed/controllers/useReelInteractions.ts
"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getCommentsService,
  addLikeService,
  removeLikeService,
  addCommentService,
} from "@/features/feed/services/interactions.service";

import { getProfileService } from "@/features/profile/services/profile.service";

import type { ComentarioDetalle, ReelInfo } from "@/shared/types/api.types";
import { TipoInteraccion } from "@/shared/types/api.types";

import type { CommentProfileMap } from "@/features/feed/model/comments.types";

interface UseReelInteractionsProps {
  reels: ReelInfo[];
  startIndex: number;
  usuarioId: number | null;
}

export function useReelInteractions({
  reels,
  startIndex,
  usuarioId,
}: UseReelInteractionsProps) {
  // Copia local de los reels para reflejar likes/comentarios en vivo
  const [items, setItems] = useState<ReelInfo[]>(reels);
  const [activeIndex, setActiveIndex] = useState<number>(startIndex);

  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());

  const [comentarios, setComentarios] = useState<ComentarioDetalle[]>([]);
  const [perfilesComentarios, setPerfilesComentarios] =
    useState<CommentProfileMap>({});
  const [loadingComentarios, setLoadingComentarios] = useState(false);

  // Mantener sincronizada la copia local si cambian las props
  useEffect(() => {
    setItems(reels);
  }, [reels]);

  useEffect(() => {
    setActiveIndex(startIndex);
  }, [startIndex]);

  const reelActivo = items[activeIndex] ?? null;

  /**
   * CARGAR COMENTARIOS
   */
  const cargarComentarios = useCallback(async (reelId: number) => {
    // Reels de fallback (id negativo) no consultan al backend
    if (reelId < 0) {
      setComentarios([]);
      setPerfilesComentarios({});
      return;
    }

    setLoadingComentarios(true);

    try {
      const data = await getCommentsService({ reelId });
      const lista = Array.isArray(data) ? data : [];

      const normalizados = lista.map((comentario, index) => ({
        ...comentario,
        contenido: comentario.contenido?.trim() || `Comentario ${index + 1}`,
      }));

      setComentarios(normalizados);

      const usuariosUnicos = Array.from(
        new Set(normalizados.map((c) => c.usuarioId))
      );

      const perfiles: CommentProfileMap = {};

      for (const uid of usuariosUnicos) {
        try {
          perfiles[uid] = await getProfileService({ id: uid });
        } catch {
          // Si falla un perfil, continuamos con el resto
        }
      }

      setPerfilesComentarios(perfiles);
    } catch {
      setComentarios([]);
      setPerfilesComentarios({});
    } finally {
      setLoadingComentarios(false);
    }
  }, []);

  // Recargar comentarios cuando cambia el reel activo
  useEffect(() => {
    if (!reelActivo) return;
    void cargarComentarios(reelActivo.id);
  }, [reelActivo, cargarComentarios]);

  /**
   * NAVEGACIÓN
   */
  const reelAnterior = useCallback(() => {
    setActiveIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const reelSiguiente = useCallback(() => {
    setActiveIndex((i) => (i < items.length - 1 ? i + 1 : i));
  }, [items.length]);

  /**
   * LIKE (optimista)
   */
  const toggleLike = useCallback(async () => {
    if (!reelActivo || !usuarioId) return;

    const reelId = reelActivo.id;
    const yaLikeado = likedReels.has(reelId);

    setLikedReels((prev) => {
      const next = new Set(prev);
      if (yaLikeado) next.delete(reelId);
      else next.add(reelId);
      return next;
    });

    setItems((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              contadorLikes: Math.max(0, r.contadorLikes + (yaLikeado ? -1 : 1)),
            }
          : r
      )
    );

    if (reelId < 0) return;

    try {
      if (yaLikeado) {
        await removeLikeService({ usuarioId, reelId });
      } else {
        await addLikeService({ usuarioId, reelId });
      }
    } catch {
      // Rollback
      setLikedReels((prev) => {
        const next = new Set(prev);
        if (yaLikeado) next.add(reelId);
        else next.delete(reelId);
        return next;
      });

      setItems((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? {
                ...r,
                contadorLikes: Math.max(
                  0,
                  r.contadorLikes + (yaLikeado ? 1 : -1)
                ),
              }
            : r
        )
      );
    }
  }, [reelActivo, likedReels, usuarioId]);

  /**
   * COMENTAR (optimista)
   */
  const agregarComentario = useCallback(
    async (contenido: string) => {
      const texto = contenido.trim();
      if (!texto || !reelActivo || !usuarioId) return;

      const reelId = reelActivo.id;

      const optimista: ComentarioDetalle = {
        id: Date.now() * -1,
        tipo: TipoInteraccion.COMENTARIO,
        usuarioId,
        reelId,
        fecha: new Date().toISOString(),
        contenido: texto,
      };

      setComentarios((prev) => [optimista, ...prev]);

      setItems((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? { ...r, contadorComentarios: r.contadorComentarios + 1 }
            : r
        )
      );

      if (reelId < 0) return;

      try {
        await addCommentService({ usuarioId, reelId, contenido: texto });
        await cargarComentarios(reelId);
      } catch {
        // Rollback
        setComentarios((prev) => prev.filter((c) => c.id !== optimista.id));

        setItems((prev) =>
          prev.map((r) =>
            r.id === reelId
              ? {
                  ...r,
                  contadorComentarios: Math.max(0, r.contadorComentarios - 1),
                }
              : r
          )
        );
      }
    },
    [reelActivo, usuarioId, cargarComentarios]
  );

  const reelLikeado = reelActivo ? likedReels.has(reelActivo.id) : false;

  return {
    reelActivo,
    activeIndex,
    total: items.length,

    comentarios,
    perfilesComentarios,
    loadingComentarios,

    reelLikeado,

    reelAnterior,
    reelSiguiente,

    toggleLike,
    agregarComentario,
  };
}