// src/features/profile/controllers/useProfile.ts

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/controllers/authContext";

import {
  getProfileService,
  getProfileReelsService,
  updateProfileService,
  uploadProfilePhotoService,
  changeUsernameService,
  deleteAccountService,
} from "@/features/profile/services/profile.service";
import { deleteReelService } from "@/features/feed/services/reel.service";

import type { PerfilInfo, ReelInfo, UsuarioInfo } from "@/shared/types/api.types";
import { EstadoReel } from "@/shared/types/api.types";

const STORAGE_CANAL_ID = "reelclips_canalId";

function getMensajeError(e: unknown, fallback: string): string {
  if (e instanceof Error && e.message) return e.message;
  return fallback;
}

function getFechaPublicacionTime(reel: ReelInfo): number {
  const fecha = new Date(reel.fechaPublicacion).getTime();
  return Number.isFinite(fecha) ? fecha : 0;
}

export type GuardarPerfilInput = {
  nombre: string;
  descripcion: string;
  fotoFile?: File | null;
};

type DesactivarCuentaOptions = {
  confirmar?: boolean;
};

type EliminarPublicacionOptions = {
  confirmar?: boolean;
};

export function useProfile() {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();

  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [perfil, setPerfil] = useState<PerfilInfo | null>(null);
  const [publicaciones, setPublicaciones] = useState<ReelInfo[]>([]);

  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [deletingReelIds, setDeletingReelIds] = useState<Set<number>>(new Set());

  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const usuarioId = user?.id;

  useEffect(() => {
    if (!usuarioId) {
      router.replace("/login");
      return;
    }

    let cancelled = false;

    queueMicrotask(() => {
      if (!cancelled) setUsuario(user as UsuarioInfo);
    });

    const cargar = async () => {
      setLoadingPerfil(true);
      setLoadingPublicaciones(true);

      try {
        const p = await getProfileService({ id: usuarioId });

        if (!cancelled && p) {
          setPerfil(p);
        }
      } catch {
        if (!cancelled && user) {
          setPerfil({
            id: user.id,
            username: user.username ?? "",
            nombreVisualizacion: user.nombreVisualizacion,
            fotoPerfil: user.fotoPerfil,
            descripcion: "",
          } as PerfilInfo);
        }
      } finally {
        if (!cancelled) setLoadingPerfil(false);
      }

      try {
        const reels = await getProfileReelsService({ canalId: usuarioId });
        if (!cancelled) setPublicaciones(Array.isArray(reels) ? reels : []);
      } catch {
        if (!cancelled) setPublicaciones([]);
      } finally {
        if (!cancelled) setLoadingPublicaciones(false);
      }
    };

    void cargar();

    return () => {
      cancelled = true;
    };
  }, [usuarioId, user, router]);

  const publicacionesActivas = useMemo(() => {
    return publicaciones
      .filter(
        (reel) =>
          reel.estado !== EstadoReel.ELIMINADO &&
          (!usuarioId || reel.canalId === usuarioId)
      )
      .sort(
        (a, b) =>
          getFechaPublicacionTime(b) - getFechaPublicacionTime(a)
      );
  }, [publicaciones, usuarioId]);

  const guardarPerfil = useCallback(
    async ({ nombre, descripcion, fotoFile }: GuardarPerfilInput): Promise<boolean> => {
      if (!usuarioId) {
        setError("No hay usuario autenticado.");
        return false;
      }

      setGuardando(true);
      setError(null);
      setAviso(null);

      try {
        let fotoUrl = perfil?.fotoPerfil ?? "";

        if (fotoFile) {
          const subido = await uploadProfilePhotoService({
            id: usuarioId,
            foto: fotoFile,
          });

          fotoUrl = subido?.fotoPerfil ?? fotoUrl;
        }

        const actualizado = await updateProfileService({
          id: usuarioId,
          nombre,
          foto: fotoUrl,
          descripcion,
        });

        setUser({
          id: actualizado.id,
          username: actualizado.username,
          nombreVisualizacion: actualizado.nombreVisualizacion ?? undefined,
          fotoPerfil: actualizado.fotoPerfil ?? undefined,
        });

        setUsuario(actualizado);
        setPerfil({
          id: actualizado.id,
          username: actualizado.username,
          nombreVisualizacion: actualizado.nombreVisualizacion,
          fotoPerfil: actualizado.fotoPerfil,
          descripcion: actualizado.descripcion,
        });

        setAviso("Perfil actualizado");
        return true;
      } catch (e) {
        setError(getMensajeError(e, "No se pudo actualizar el perfil"));
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId, perfil, setUser]
  );

  const cambiarUsername = useCallback(
    async (nuevoUsername: string): Promise<boolean> => {
      if (!usuarioId) {
        setError("No hay usuario autenticado.");
        return false;
      }

      const limpio = nuevoUsername.trim();
      if (!limpio) return false;

      setGuardando(true);
      setError(null);
      setAviso(null);

      try {
        const actualizado = await changeUsernameService({
          id: usuarioId,
          nuevoUsername: limpio,
        });

        setUser({
          id: actualizado.id,
          username: actualizado.username,
          nombreVisualizacion: actualizado.nombreVisualizacion ?? undefined,
          fotoPerfil: actualizado.fotoPerfil ?? undefined,
        });

        setUsuario(actualizado);
        setPerfil((prev) =>
          prev ? { ...prev, username: actualizado.username } : prev
        );

        setAviso("Nombre de usuario actualizado");
        return true;
      } catch (e) {
        setError(getMensajeError(e, "No se pudo cambiar el nombre de usuario"));
        return false;
      } finally {
        setGuardando(false);
      }
    },
    [usuarioId, setUser]
  );

  const cerrarSesion = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_CANAL_ID);
    }

    logout();
    router.push("/login");
  }, [logout, router]);

  const desactivarCuenta = useCallback(async (options?: DesactivarCuentaOptions): Promise<boolean> => {
    const requiereConfirmacion = options?.confirmar ?? true;

    if (
      requiereConfirmacion &&
      typeof window !== "undefined" &&
      !window.confirm("¿Estas seguro de desactivar tu cuenta?")
    ) {
      return false;
    }

    if (!usuarioId) {
      setError("No hay usuario autenticado.");
      return false;
    }

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

  const eliminarPublicacion = useCallback(
    async (
      reelId: number,
      options?: EliminarPublicacionOptions
    ): Promise<boolean> => {
      const requiereConfirmacion = options?.confirmar ?? true;

      if (
        requiereConfirmacion &&
        typeof window !== "undefined" &&
        !window.confirm("¿Seguro que quieres eliminar esta publicación?")
      ) {
        return false;
      }

      if (!usuarioId) {
        setError("No hay usuario autenticado.");
        return false;
      }

      setError(null);
      setAviso(null);
      setDeletingReelIds((prev) => new Set(prev).add(reelId));

      try {
        await deleteReelService(reelId, usuarioId);
        setPublicaciones((prev) => prev.filter((reel) => reel.id !== reelId));
        setAviso("Publicacion eliminada");
        return true;
      } catch (e) {
        setError(getMensajeError(e, "No se pudo eliminar la publicacion"));
        return false;
      } finally {
        setDeletingReelIds((prev) => {
          const next = new Set(prev);
          next.delete(reelId);
          return next;
        });
      }
    },
    [usuarioId]
  );

  return {
    usuario,
    perfil,
    publicaciones: publicacionesActivas,
    totalPublicaciones: publicacionesActivas.length,

    loadingPerfil,
    loadingPublicaciones,
    guardando,
    deletingReelIds,
    error,
    aviso,

    guardarPerfil,
    cambiarUsername,
    eliminarPublicacion,
    cerrarSesion,
    desactivarCuenta,
    limpiarMensajes,
  };
}
