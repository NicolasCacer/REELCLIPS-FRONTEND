// src/features/profile/controllers/useProfile.ts

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/features/auth/controllers/authContext";

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

const STORAGE_CANAL_ID = "reelclips_canalId";

type PerfilConCanal = PerfilInfo & { canalId?: number };

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
  const { user, setUser, logout } = useAuth();

  const [usuario, setUsuario] = useState<UsuarioInfo | null>(null);
  const [perfil, setPerfil] = useState<PerfilInfo | null>(null);
  const [publicaciones, setPublicaciones] = useState<ReelInfo[]>([]);

  const [loadingPerfil, setLoadingPerfil] = useState(true);
  const [loadingPublicaciones, setLoadingPublicaciones] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const usuarioId = user?.id;

  useEffect(() => {
    if (!usuarioId) {
      router.replace("/login");
      return;
    }

    setUsuario(user as UsuarioInfo);

    let cancelled = false;

    const cargar = async () => {
      setLoadingPerfil(true);
      setLoadingPublicaciones(true);

      let canalId: number | null = getStoredCanalId();

      try {
        const p = await getProfileService({ id: usuarioId });

        if (!cancelled && p) {
          setPerfil(p);
          canalId = (p as PerfilConCanal).canalId ?? canalId;
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
        if (canalId != null) {
          const reels = await getCanalReelsService(canalId);
          if (!cancelled) setPublicaciones(Array.isArray(reels) ? reels : []);
        } else if (!cancelled) {
          setPublicaciones([]);
        }
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

  const publicacionesActivas = useMemo(
    () => publicaciones.filter((r) => r.estado !== EstadoReel.ELIMINADO),
    [publicaciones]
  );

  const totalLikes = useMemo(
    () => publicacionesActivas.reduce((s, r) => s + (r.contadorLikes || 0), 0),
    [publicacionesActivas]
  );

  const totalComentarios = useMemo(
    () =>
      publicacionesActivas.reduce(
        (s, r) => s + (r.contadorComentarios || 0),
        0
      ),
    [publicacionesActivas]
  );

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

  const desactivarCuenta = useCallback(async (): Promise<boolean> => {
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

  return {
    usuario,
    perfil,
    publicaciones: publicacionesActivas,
    totalPublicaciones: publicacionesActivas.length,
    totalLikes,
    totalComentarios,

    loadingPerfil,
    loadingPublicaciones,
    guardando,
    error,
    aviso,

    guardarPerfil,
    cambiarUsername,
    cerrarSesion,
    desactivarCuenta,
    limpiarMensajes,
  };
}