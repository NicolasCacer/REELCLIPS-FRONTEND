// src/features/feed/controllers/useHomeFeed.ts
"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "@/features/auth/controllers/authContext";

import {
  getFeedService,
  getAllCategoriesService,
} from "@/features/feed/services/feed.service";

import { getAllReelsService } from "@/features/feed/services/reel.service";

import {
  getCommentsService,
  addLikeService,
  removeLikeService,
  addCommentService,
} from "@/features/feed/services/interactions.service";

import { getProfileService } from "@/features/profile/services/profile.service";

import type {
  ReelInfo,
  CategoriaInfo,
  ComentarioDetalle,
  UsuarioInfo,
  PerfilInfo,
} from "@/shared/types/api.types";

import type { CommentProfileMap } from "@/features/feed/model/comments.types";

import {
  EstadoReel,
  TipoInteraccion,
} from "@/shared/types/api.types";

const FALLBACK_CATEGORIES: string[] = [
  "Arte",
  "Música",
  "Estudio",
  "Humor",
  "Deportes",
];

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
    contenido: "Muy buen reel 🔥",
  },
  {
    id: -3,
    tipo: TipoInteraccion.COMENTARIO,
    usuarioId: 13,
    reelId: -1,
    fecha: new Date().toISOString(),
    contenido: "Necesito más contenido así",
  },
];

export type HomeContacto = {
  id: number;
  nombre: string;
  fotoPerfil: string | null;
};

export function useHomeFeed() {
  const { user } = useAuth();

  const [usuario, setUsuario] =
    useState<UsuarioInfo | null>(null);

  const [usuarioId, setUsuarioId] =
    useState<number | null>(null);

  const [categorias, setCategorias] = useState<string[]>(
    FALLBACK_CATEGORIES
  );

  const [categoriaActiva, setCategoriaActiva] =
    useState<string | null>(null);

  const [reels, setReels] = useState<ReelInfo[]>([]);

  const [reelActivoIndex, setReelActivoIndex] =
    useState<number>(0);

  const [comentarios, setComentarios] = useState<
    ComentarioDetalle[]
  >([]);

  const [perfilesComentarios, setPerfilesComentarios] =
    useState<CommentProfileMap>({});

  const [likedReels, setLikedReels] = useState<Set<number>>(
    new Set()
  );

  const [loadingReels, setLoadingReels] =
    useState<boolean>(true);

  const [loadingComentarios, setLoadingComentarios] =
    useState<boolean>(false);

  const [error, setError] = useState<string | null>(
    null
  );

  /**
   * FILTRAR REELS POR CATEGORÍA
   */
  const reelsFiltrados = useMemo(() => {
    if (!categoriaActiva) {
      return reels;
    }

    return reels.filter((reel) =>
      reel.categorias?.includes(
        categoriaActiva
      )
    );
  }, [reels, categoriaActiva]);

  const reelActivo =
    reelsFiltrados[reelActivoIndex] ?? null;

  const contactos: HomeContacto[] = useMemo(
    () => [
      {
        id: 1,
        nombre: "Pepito Peréz",
        fotoPerfil: null,
      },
      {
        id: 2,
        nombre: "Pepito Peréz",
        fotoPerfil: null,
      },
    ],
    []
  );

  /**
   * CARGAR COMENTARIOS
   */
  const cargarComentarios = useCallback(
    async (reelId: number) => {
      if (reelId < 0) {
        setComentarios(FALLBACK_COMMENTS);
        setPerfilesComentarios({});
        return;
      }

      setLoadingComentarios(true);

      try {
        const data = await getCommentsService({
          reelId,
        });

        const lista = Array.isArray(data) ? data : [];

        // FALLBACK TEMPORAL:
        // backend todavía no manda "contenido"
        const normalizados = lista.map((c, index) => ({
          ...c,
          contenido:
            c.contenido?.trim() ||
            `Comentario ${index + 1}`,
        }));

        setComentarios(normalizados);

        // Cargar perfiles de usuarios que comentaron
        const usuariosUnicos = Array.from(
          new Set(normalizados.map((c) => c.usuarioId))
        );

        const perfiles: CommentProfileMap = {};

        for (const uid of usuariosUnicos) {
          try {
            const perfil = await getProfileService({
              id: uid,
            });
            perfiles[uid] = perfil;
          } catch {
            // Si falla cargar el perfil, continuar
          }
        }

        setPerfilesComentarios(perfiles);
      } catch {
        setComentarios([]);
        setPerfilesComentarios({});
      } finally {
        setLoadingComentarios(false);
      }
    },
    []
  );

  /**
   * CARGAR FEED
   */
  useEffect(() => {
    if (!user?.id) {
      setUsuario(null);
      setUsuarioId(null);
      setReels(FALLBACK_REELS);
      setLoadingReels(false);

      return;
    }

    const uid = user.id;

    setUsuario(user as UsuarioInfo);
    setUsuarioId(uid);

    let cancelled = false;

    const cargar = async () => {
      setLoadingReels(true);
      setError(null);
      setReelActivoIndex(0);

      /**
       * Categorías
       */
      try {
        const cats: CategoriaInfo[] =
          await getAllCategoriesService();

        if (
          !cancelled &&
          Array.isArray(cats) &&
          cats.length > 0
        ) {
          setCategorias(cats.map((c) => c.nombre));
        }
      } catch {
        // Mantener fallback
      }

      /**
       * Feed
       */
      try {
        const feed = await getFeedService({
          usuarioId: uid,
          pagina: 0,
        });

        const lista = feed?.reels ?? [];

        if (!cancelled) {
          setReels(
            lista.length > 0
              ? lista
              : FALLBACK_REELS
          );
        }
      } catch {
        try {
          const todos =
            await getAllReelsService();

          if (!cancelled) {
            setReels(
              todos.length > 0
                ? todos
                : FALLBACK_REELS
            );
          }
        } catch {
          if (!cancelled) {
            setReels(FALLBACK_REELS);
          }
        }
      } finally {
        if (!cancelled) {
          setLoadingReels(false);
        }
      }
    };

    void cargar();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /**
   * RECARGAR COMENTARIOS
   * CUANDO CAMBIA EL REEL
   */
  useEffect(() => {
    if (!reelActivo) return;

    void cargarComentarios(reelActivo.id);
  }, [reelActivo, cargarComentarios]);

  /**
   * CATEGORÍA
   */
  const seleccionarCategoria = useCallback(
    (nombre: string) => {
      setCategoriaActiva((prev) =>
        prev === nombre ? null : nombre
      );
      // Resetear a primer reel al cambiar categoría
      setReelActivoIndex(0);
    },
    []
  );

  /**
   * NAVEGACIÓN
   */
  const reelAnterior = useCallback(() => {
    setReelActivoIndex((i) =>
      i > 0 ? i - 1 : i
    );
  }, []);

  const reelSiguiente = useCallback(() => {
    setReelActivoIndex((i) =>
      i < reelsFiltrados.length - 1
        ? i + 1
        : i
    );
  }, [reelsFiltrados.length]);

  /**
   * LIKE
   */
  const toggleLike = useCallback(async () => {
    if (!reelActivo || !usuarioId) return;

    const reelId = reelActivo.id;

    const yaLikeado =
      likedReels.has(reelId);

    /**
     * Optimista
     */
    setLikedReels((prev) => {
      const next = new Set(prev);

      if (yaLikeado) next.delete(reelId);
      else next.add(reelId);

      return next;
    });

    setReels((prev) =>
      prev.map((r) =>
        r.id === reelId
          ? {
              ...r,
              contadorLikes: Math.max(
                0,
                r.contadorLikes +
                  (yaLikeado ? -1 : 1)
              ),
            }
          : r
      )
    );

    if (reelId < 0) return;

    try {
      if (yaLikeado) {
        await removeLikeService({
          usuarioId,
          reelId,
        });
      } else {
        await addLikeService({
          usuarioId,
          reelId,
        });
      }
    } catch {
      /**
       * Rollback
       */
      setLikedReels((prev) => {
        const next = new Set(prev);

        if (yaLikeado) next.add(reelId);
        else next.delete(reelId);

        return next;
      });

      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? {
                ...r,
                contadorLikes: Math.max(
                  0,
                  r.contadorLikes +
                    (yaLikeado ? 1 : -1)
                ),
              }
            : r
        )
      );
    }
  }, [
    reelActivo,
    likedReels,
    usuarioId,
  ]);

  /**
   * COMENTAR
   */
  const agregarComentario = useCallback(
    async (contenido: string) => {
      const texto = contenido.trim();

      if (
        !texto ||
        !reelActivo ||
        !usuarioId
      ) {
        return;
      }

      const reelId = reelActivo.id;

      /**
       * Comentario optimista
       */
      const optimista: ComentarioDetalle = {
        id: Date.now() * -1,
        tipo: TipoInteraccion.COMENTARIO,
        usuarioId,
        reelId,
        fecha: new Date().toISOString(),
        contenido: texto,
      };

      setComentarios((prev) => [
        optimista,
        ...prev,
      ]);

      /**
       * Contador optimista
       */
      setReels((prev) =>
        prev.map((r) =>
          r.id === reelId
            ? {
                ...r,
                contadorComentarios:
                  r.contadorComentarios + 1,
              }
            : r
        )
      );

      if (reelId < 0) return;

      try {
        await addCommentService({
          usuarioId,
          reelId,
          contenido: texto,
        });

        /**
         * Re-sync real
         */
        await cargarComentarios(reelId);
      } catch {
        /**
         * Rollback
         */
        setComentarios((prev) =>
          prev.filter(
            (c) => c.id !== optimista.id
          )
        );

        setReels((prev) =>
          prev.map((r) =>
            r.id === reelId
              ? {
                  ...r,
                  contadorComentarios:
                    Math.max(
                      0,
                      r.contadorComentarios - 1
                    ),
                }
              : r
          )
        );
      }
    },
    [
      reelActivo,
      usuarioId,
      cargarComentarios,
    ]
  );

  const reelLikeado = reelActivo
    ? likedReels.has(reelActivo.id)
    : false;

  return {
    usuario,
    contactos,

    categorias,
    categoriaActiva,

    reels: reelsFiltrados,
    reelActivo,
    reelActivoIndex,

    comentarios,
    perfilesComentarios,

    reelLikeado,

    loadingReels,
    loadingComentarios,

    error,

    seleccionarCategoria,

    reelAnterior,
    reelSiguiente,

    toggleLike,
    agregarComentario,
  };
}