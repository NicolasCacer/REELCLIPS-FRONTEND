// src/features/profile/controllers/useProfile.ts
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getProfileService,
  updateProfileService,
  uploadProfilePhotoService,
  changeUsernameService,
  deleteAccountService,
} from "@/features/profile/services/profile.service";
import { getCanalReelsService } from "@/features/feed/services/reel.service";

import type { PerfilInfo, ReelInfo, UsuarioInfo } from "@/shared/types/api.types";
import { EstadoReel } from "@/shared/types/api.types";

/**
 * Controlador del Perfil (capa de presentación).
 *
 * Consume EXCLUSIVAMENTE servicios de frontend existentes (perfil + reels).
 * No modifica el backend.
 *
 * Limitación de contrato: el backend no expone el `canalId` del usuario a
 * partir de su `usuarioId`, y las publicaciones solo se listan por canal
 * (GET /api/reels/canal/{canalId}). Por eso el canalId se resuelve de forma
 * defensiva: del propio perfil si lo trajera, o de localStorage. Si no se
 * puede determinar, se muestran publicaciones de marcador de posición.
 */

const STORAGE_USER = "reelclips_user";
const STORAGE_USER_ID = "reelclips_userId";
const STORAGE_CANAL_ID = "reelclips_canalId";

type PerfilConCanal = PerfilInfo & { canalId?: number };

// Publicaciones de marcador de posición (sin backend / sin canalId conocido).
const FALLBACK_PUBLICACIONES: ReelInfo[] = Array.from({ length: 6 }).map((_, i) => ({
  id: -(i + 1),
  urlVideo: "",
  urlMiniatura: "",
  descripcion: "Publicación de ejemplo",
  duracionSegundos: 30,
  tamanoArchivoMB: 0,
  estado: EstadoReel.ACTIVO,
  fechaPublicacion: new Date().toISOString(),
  contadorLikes: [128, 87, 240, 56, 19, 312][i] ?? 0,
  contadorComentarios: [12, 4, 33, 7, 1, 28][i] ?? 0,
  canalId: 0,
  categorias: [["Arte"], ["Música"], ["Estudio"], ["Humor"], ["Arte"], ["Deportes"]][i] ?? [],
}));

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

function getStoredCanalId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_CANAL_ID);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
}

function getMensajeError(e: unknown, fallback: string): string {
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

export type GuardarPerfilInput = {
  nombre: string;
  descripcion: string;
  fotoFile?: File | null;
};

export function useProfile() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [usuarioId, setUsuarioId] = useState<number>(1);
  const [perfil, setPerfil] = useState<PerfilInfo | null>(null);
  const [publicaciones, setPublicaciones] = useState<ReelInfo[]>([]);

  const [loadingPerfil, setLoadingPerfil] = useState<boolean>(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState<boolean>(true);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  // --- Carga inicial: perfil + publicaciones ------------------------------
  useEffect(() => {
    const uid = getStoredUserId();
    setUsuarioId(uid);
    const stored = getStoredUser();
    setUsuario(stored);

    let cancelled = false;

    const cargar = async () => {
      setLoadingPerfil(true);
      setLoadingPublicaciones(true);

      let canalId: number | null = getStoredCanalId();

      // Perfil
      try {
        const p = await getProfileService({ id: uid });
        if (!cancelled && p) {
          setPerfil(p);
          canalId = (p as PerfilConCanal).canalId ?? canalId;
        }
      } catch {
        // Respaldo con los datos de localStorage del login.
        if (!cancelled && stored) {
          setPerfil({
            id: stored.id,
            username: stored.username,
            nombreVisualizacion: stored.nombreVisualizacion,
            fotoPerfil: stored.fotoPerfil,
            descripcion: stored.descripcion,
          });
        }
      } finally {
        if (!cancelled) setLoadingPerfil(false);
      }

      // Publicaciones (por canal)
      try {
        if (canalId != null) {
          const reels = await getCanalReelsService(canalId);
          if (!cancelled) {
            setPublicaciones(Array.isArray(reels) ? reels : []);
          }
        } else if (!cancelled) {
          // Sin canalId conocido: marcador de posición para previsualizar el layout.
          setPublicaciones(FALLBACK_PUBLICACIONES);
        }
      } catch {
        if (!cancelled) setPublicaciones(FALLBACK_PUBLICACIONES);
      } finally {
        if (!cancelled) setLoadingPublicaciones(false);
      }
    };

    void cargar();
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Estadísticas -------------------------------------------------------
  const publicacionesActivas = useMemo(
    () => publicaciones.filter((r) => r.estado !== EstadoReel.ELIMINADO),
    [publicaciones]
  );
  const totalLikes = useMemo(
    () => publicacionesActivas.reduce((s, r) => s + (r.contadorLikes || 0), 0),
    [publicacionesActivas]
  );
  const totalComentarios = useMemo(
    () => publicacionesActivas.reduce((s, r) => s + (r.contadorComentarios || 0), 0),
    [publicacionesActivas]
  );

  // --- Acciones -----------------------------------------------------------

  const guardarPerfil = useCallback(
    async ({ nombre, descripcion, fotoFile }: GuardarPerfilInput): Promise<boolean> => {
      setGuardando(true);
      setError(null);
      setAviso(null);
      try {
        let fotoUrl = perfil?.fotoPerfil ?? "";

        // Si hay un archivo nuevo, súbelo primero (multipart) y usa su URL.
        if (fotoFile) {
          const subido = await uploadProfilePhotoService({ id: usuarioId, foto: fotoFile });
          fotoUrl = subido?.fotoPerfil ?? fotoUrl;
        }

        const actualizado = await updateProfileService({
          id: usuarioId,
          nombre,
          foto: fotoUrl,
          descripcion,
        });

        setUsuario(actualizado);
        setPerfil({
          id: actualizado.id,
          username: actualizado.username,
          nombreVisualizacion: actualizado.nombreVisualizacion,
          fotoPerfil: actualizado.fotoPerfil,
          descripcion: actualizado.descripcion,
        });
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_USER, JSON.stringify(actualizado));
        }
        setAviso("Perfil actualizado");
        return true;
      } catch (e) {
        setError(getMensajeError(e, "No se pudo actualizar el perfil"));
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [perfil, usuarioId]
  );

  const cambiarUsername = useCallback(
    async (nuevoUsername: string): Promise<boolean> => {
      const limpio = nuevoUsername.trim();
      if (!limpio) return false;
      setGuardando(true);
      setError(null);
      setAviso(null);
      try {
        const actualizado = await changeUsernameService({ id: usuarioId, nuevoUsername: limpio });
        setUsuario(actualizado);
        setPerfil((prev) => (prev ? { ...prev, username: actualizado.username } : prev));
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_USER, JSON.stringify(actualizado));
        }
        setAviso("Nombre de usuario actualizado");
        return true;
      } catch (e) {
        setError(getMensajeError(e, "No se pudo cambiar el nombre de usuario"));
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId]
  );

  const cerrarSesion = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_USER);
      window.localStorage.removeItem(STORAGE_USER_ID);
      window.localStorage.removeItem(STORAGE_CANAL_ID);
    }
    router.push("/login");
  }, [router]);

  const desactivarCuenta = useCallback(async (): Promise<boolean> => {
    setGuardando(true);
    setError(null);
    try {
      await deleteAccountService({ id: usuarioId });
      cerrarSesion();
      return true;
    } catch (e) {
      setError(getMensajeError(e, "No se pudo desactivar la cuenta"));
      setGuardando(false);
      return false;
    }
  }, [usuarioId, cerrarSesion]);

  const limpiarMensajes = useCallback(() => {
    setError(null);
    setAviso(null);
  }, []);

  return {
    // datos
    usuario,
    perfil,
    publicaciones: publicacionesActivas,
    totalPublicaciones: publicacionesActivas.length,
    totalLikes,
    totalComentarios,
    // estado
    loadingPerfil,
    loadingPublicaciones,
    guardando,
    error,
    aviso,
    // acciones
    guardarPerfil,
    cambiarUsername,
    cerrarSesion,
    desactivarCuenta,
    limpiarMensajes,
  };
}