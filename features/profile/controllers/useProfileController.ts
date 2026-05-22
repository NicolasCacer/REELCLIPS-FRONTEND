// features/profile/controllers/useProfileController.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getProfileService,
  updateProfileService,
  uploadProfilePhotoService,
  changeUsernameService,
  deleteAccountService,
} from "../services/profile.service";
import type {
  GetProfileRequest,
  UpdateProfileRequest,
  UploadProfilePhotoRequest,
  ChangeUsernameRequest,
  DeleteAccountRequest,
} from "../model/profile.types";
import type { PerfilInfo, UsuarioInfo } from "@/shared/types/api.types";

interface UseProfileControllerProps {
  userId: number;
}

export function useProfileController({ userId }: UseProfileControllerProps) {
  const [perfil, setPerfil] = useState<PerfilInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GET: Obtener perfil del usuario
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");

      const request: GetProfileRequest = { id: userId };
      const perfilData = await getProfileService(request);
      setPerfil(perfilData);
    } catch (err) {
      setError("No se pudo cargar el perfil del usuario.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // PUT: Actualizar perfil
  const handleUpdateProfile = useCallback(
    async (nombre: string, foto: string, descripcion: string) => {
      try {
        setIsLoading(true);
        setError("");
        setSuccess("");

        const request: UpdateProfileRequest = {
          id: userId,
          nombre,
          foto,
          descripcion,
        };

        const updatedUsuario = await updateProfileService(request);
        setPerfil({
          id: updatedUsuario.id,
          username: updatedUsuario.username,
          nombreVisualizacion: updatedUsuario.nombreVisualizacion,
          fotoPerfil: updatedUsuario.fotoPerfil,
          descripcion: updatedUsuario.descripcion,
        });
        setSuccess("Perfil actualizado correctamente.");
      } catch (err) {
        setError("No se pudo actualizar el perfil.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // POST: Subir foto de perfil
  const handleUploadProfilePhoto = useCallback(
    async (foto: File) => {
      try {
        setIsLoading(true);
        setError("");
        setSuccess("");

        const request: UploadProfilePhotoRequest = {
          id: userId,
          foto,
        };

        const updatedUsuario = await uploadProfilePhotoService(request);
        setPerfil((prev) =>
          prev
            ? {
                ...prev,
                fotoPerfil: updatedUsuario.fotoPerfil,
              }
            : null
        );
        setSuccess("Foto de perfil subida correctamente.");
      } catch (err) {
        setError("No se pudo subir la foto de perfil.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // PATCH: Cambiar nombre de usuario
  const handleChangeUsername = useCallback(
    async (nuevoUsername: string) => {
      try {
        setIsLoading(true);
        setError("");
        setSuccess("");

        const request: ChangeUsernameRequest = {
          id: userId,
          nuevoUsername,
        };

        const updatedUsuario = await changeUsernameService(request);
        setPerfil((prev) =>
          prev
            ? {
                ...prev,
                username: updatedUsuario.username,
              }
            : null
        );
        setSuccess("Nombre de usuario cambiado correctamente.");
      } catch (err) {
        setError(
          "No se pudo cambiar el nombre de usuario. Intenta más tarde."
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // DELETE: Desactivar cuenta
  const handleDeleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const request: DeleteAccountRequest = { id: userId };
      await deleteAccountService(request);

      setSuccess(
        "Tu cuenta ha sido desactivada. Los datos se conservarán 30 días."
      );
      // Redirigir a login después de un tiempo
      setTimeout(() => {
        localStorage.removeItem("reelclips_user");
        localStorage.removeItem("reelclips_user_id");
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError("No se pudo desactivar la cuenta.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Cargar perfil al montar
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    perfil,
    isLoading,
    error,
    success,
    loadProfile,
    handleUpdateProfile,
    handleUploadProfilePhoto,
    handleChangeUsername,
    handleDeleteAccount,
  };
}
