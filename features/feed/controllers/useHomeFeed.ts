// src/features/feed/controllers/useHomeFeed.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getFeedService, getAllCategoriesService } from "@/features/feed/services/feed.service";
import { getAllReelsService } from "@/features/feed/services/reel.service";
import {
  getCommentsService,
  addLikeService,
  removeLikeService,
  addCommentService,
} from "@/features/feed/services/interactions.service";

import type {
  ReelInfo,
  CategoriaInfo,
  ComentarioDetalle,
  UsuarioInfo,
} from "@/shared/types/api.types";
import { EstadoReel, TipoInteraccion } from "@/shared/types/api.types";

/**
 * Controlador del Home (capa de presentación).
 *
 * Consume EXCLUSIVAMENTE los servicios de frontend ya existentes
 * (feed / reels / interacciones). No modifica el backend.
 *
 * Si el backend no está disponible, cae a contenido de marcador de posición
 * para que la vista siempre renderice de forma fiel al diseño.
 */

const STORAGE_USER = "reelclips_user";
const STORAGE_USER_ID = "reelclips_userId";

// ---- Marcadores de posición (solo si el backend no responde) -------------

const FALLBACK_CATEGORIES: string[] = ["Arte", "Música", "Estudio", "Humor", "Deportes"];

const FALLBACK_REELS: ReelInfo[] = [
  {
    id: -1,
    urlVideo: "",
    urlMiniatura: "",
    descripcion: "Tu primer reel aparecerá aquí ✨",
    duracionSegundos: 30,
    tamanoArchivoMB: 0,
    estado: EstadoReel.ACTIVO,
    fechaPublicacion: new Date().toISOString(),
    contadorLikes: 128,
    contadorComentarios: 3,
    canalId: 0,
    categorias: ["Arte"],
  },
  {
    id: -2,
    urlVideo: "",
    urlMiniatura: "",
    descripcion: "Descubre contenido de la comunidad",
    duracionSegundos: 45,
    tamanoArchivoMB: 0,
    estado: EstadoReel.ACTIVO,
    fechaPublicacion: new Date().toISOString(),
    contadorLikes: 87,
    contadorComentarios: 2,
    canalId: 0,
    categorias: ["Música"],
  },
];

const FALLBACK_COMMENTS: ComentarioDetalle[] = [
  {
    id: -1,
    tipo: TipoInteraccion.COMENTARIO,
    usuarioId: 11,
    reelId: -1,
    fecha: new Date().toISOString(),
    contenido: "Wow, me encanta, me parece genial",
  },
  {
    id: -2,
    tipo: TipoInteraccion.COMENTARIO,
    usuarioId: 12,
    reelId: -1,
    fecha: new Date().toISOString(),
    contenido: "Wow, me encanta, me parece genial",
  },
  {
    id: -3,
    tipo: TipoInteraccion.COMENTARIO,
    usuarioId: 13,
    reelId: -1,
    fecha: new Date().toISOString(),
    contenido: "Wow, me encanta, me parece genial",
  },
];

// ---- Helpers -------------------------------------------------------------

function getStoredUserId(): number {
  if (typeof window === "undefined") return 1;
  const raw = window.localStorage.getItem(STORAGE_USER_ID);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function getStoredUser(): UsuarioInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_USER);
    return raw ? (JSON.parse(raw) as UsuarioInfo) : null;
  } catch {
    return null;
  }
}

// ---- Hook ----------------------------------------------------------------

export type HomeContacto = {
  id: number;
  nombre: string;
  fotoPerfil: string | null;
};

export function useHomeFeed() {
  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [usuarioId, setUsuarioId] = useState<number>(1);

  const [categorias, setCategorias] = useState<string[]>(FALLBACK_CATEGORIES);
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null);

  const [reels, setReels] = useState<ReelInfo[]>([]);
  const [reelActivoIndex, setReelActivoIndex] = useState<number>(0);

  const [comentarios, setComentarios] = useState<ComentarioDetalle[]>([]);
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());

  const [loadingReels, setLoadingReels] = useState<boolean>(true);
  const [loadingComentarios, setLoadingComentarios] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const reelActivo = reels[reelActivoIndex] ?? null;

  // Contactos: el backend de contactos no está expuesto como servicio,
  // por lo que se muestran contactos de marcador de posición fieles al diseño.
  const contactos: HomeContacto[] = useMemo(
    () => [
      { id: 1, nombre: "Pepito Peréz", fotoPerfil: null },
      { id: 2, nombre: "Pepito Peréz", fotoPerfil: null },
    ],
    []
  );

  // --- Carga inicial: usuario, categorías y reels -------------------------
  useEffect(() => {
    const uid = getStoredUserId();
    setUsuarioId(uid);
    setUsuario(getStoredUser());

    let cancelled = false;

    const cargar = async () => {
      setLoadingReels(true);
      setError(null);

      // Categorías
      try {
        const cats: CategoriaInfo[] = await getAllCategoriesService();
        if (!cancelled && Array.isArray(cats) && cats.length > 0) {
          setCategorias(cats.map((c) => c.nombre));
        }
      } catch {
        // Mantener las categorías de marcador de posición.
      }

      // Reels (feed paginado -> lista completa -> marcador de posición)
      try {
        const feed = await getFeedService({ usuarioId: uid, pagina: 0 });
        const lista = feed?.reels ?? [];
        if (!cancelled) {
          setReels(lista.length > 0 ? lista : FALLBACK_REELS);
        }
      } catch {
        try {
          const todos = await getAllReelsService();
          if (!cancelled) {
            setReels(todos.length > 0 ? todos : FALLBACK_REELS);
          }
        } catch {
          if (!cancelled) {
            setReels(FALLBACK_REELS);
          }
        }
      } finally {
        if (!cancelled) setLoadingReels(false);
      }
    };

    void cargar();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Carga de comentarios del reel activo -------------------------------
  useEffect(() => {
    if (!reelActivo) return;

    // Reels de marcador de posición -> comentarios de marcador de posición.
    if (reelActivo.id < 0) {
      setComentarios(FALLBACK_COMMENTS);
      return;
    }

    let cancelled = false;
    const cargarComentarios = async () => {
      setLoadingComentarios(true);
      try {
        const data = await getCommentsService({ reelId: reelActivo.id });
        if (!cancelled) setComentarios(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setComentarios([]);
      } finally {
        if (!cancelled) setLoadingComentarios(false);
      }
    };

    void cargarComentarios();
    return () => {
      cancelled = true;
    };
  }, [reelActivo]);

  // --- Acciones -----------------------------------------------------------

  const seleccionarCategoria = useCallback((nombre: string) => {
    setCategoriaActiva((prev) => (prev === nombre ? null : nombre));
  }, []);

  const reelAnterior = useCallback(() => {
    setReelActivoIndex((i) => (i > 0 ? i - 1 : i));
  }, []);

  const reelSiguiente = useCallback(() => {
    setReelActivoIndex((i) => (i < reels.length - 1 ? i + 1 : i));
  }, [reels.length]);

  const toggleLike = useCallback(async () => {
    if (!reelActivo) return;
    const reelId = reelActivo.id;
    const yaLikeado = likedReels.has(reelId);

    // Optimista
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (yaLikeado) next.delete(reelId);
      else next.add(reelId);
      return next;
    });
    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? { ...r, contadorLikes: r.contadorLikes + (yaLikeado ? -1 : 1) }
          : r
      )
    );

    if (reelId < 0) return; // marcador de posición: no llamar al backend

    try {
      if (yaLikeado) await removeLikeService({ usuarioId, reelId });
      else await addLikeService({ usuarioId, reelId });
    } catch {
      // Revertir si falla
      setLikedReels((prev) => {
        const next = new Set(prev);
        if (yaLikeado) next.add(reelId);
        else next.delete(reelId);
        return next;
      });
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? { ...r, contadorLikes: r.contadorLikes + (yaLikeado ? 1 : -1) }
            : r
        )
      );
    }
  }, [reelActivo, likedReels, usuarioId]);

  const agregarComentario = useCallback(
    async (contenido: string) => {
      const texto = contenido.trim();
      if (!texto || !reelActivo) return;
      const reelId = reelActivo.id;

      // Optimista
      const optimista: ComentarioDetalle = {
        id: Date.now() * -1,
        tipo: TipoInteraccion.COMENTARIO,
        usuarioId,
        reelId,
        fecha: new Date().toISOString(),
        contenido: texto,
      };
      setComentarios((prev) => [...prev, optimista]);
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? { ...r, contadorComentarios: r.contadorComentarios + 1 }
            : r
        )
      );

      if (reelId < 0) return; // marcador de posición

      try {
        // NOTA DE CONTRATO: POST /api/interacciones/comentario devuelve InteraccionInfo
        // (id, tipo, usuarioId, reelId, fecha) SIN el campo `contenido`. Por eso NO
        // recargamos la lista con getCommentsService: esa respuesta también viene sin
        // `contenido` y borraría el texto recién escrito. En su lugar conservamos el
        // comentario optimista (con su texto) y solo sincronizamos el id y la fecha
        // reales que devuelve el backend.
        const creado = await addCommentService({ usuarioId, reelId, contenido: texto });
        setComentarios((prev) =>
          prev.map((c) =>
            c.id === optimista.id
              ? { ...c, id: creado?.id ?? c.id, fecha: creado?.fecha ?? c.fecha }
              : c
          )
        );
      } catch {
        // El backend rechazó el comentario: revertir el optimista y el contador.
        setComentarios((prev) => prev.filter((c) => c.id !== optimista.id));
        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId
              ? { ...r, contadorComentarios: Math.max(0, r.contadorComentarios - 1) }
              : r
          )
        );
      }
    },
    [reelActivo, usuarioId]
  );

  const reelLikeado = reelActivo ? likedReels.has(reelActivo.id) : false;

  return {
    // datos
    usuario,
    contactos,
    categorias,
    categoriaActiva,
    reels,
    reelActivo,
    reelActivoIndex,
    comentarios,
    reelLikeado,
    // estado
    loadingReels,
    loadingComentarios,
    error,
    // acciones
    seleccionarCategoria,
    reelAnterior,
    reelSiguiente,
    toggleLike,
    agregarComentario,
  };
}