// features/publish/controllers/usePublishController.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  publishReelService,
  editReelService,
  deleteReelService,
} from "../services/publish.service";
import { getAllCategoriesService } from "@/features/feed/services/feed.service";
import type {
  PublishReelRequest,
  EditReelRequest,
  DeleteReelRequest,
} from "../model/publish.types";
import type { CategoriaInfo } from "@/shared/types/api.types";

interface UsePublishControllerProps {
  userId: number;
}

export function usePublishController({ userId }: UsePublishControllerProps) {
  const router = useRouter();

  const [categories, setCategories] = useState<CategoriaInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // POST: Publicar reel
  const handlePublishReel = async (
    video: File,
    descripcion: string | undefined,
    duracionSegundos: number,
    tamanoMB: number,
    categoriaIds: number[]
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (categoriaIds.length === 0) {
        setError("Debes seleccionar al menos una categoría.");
        setIsLoading(false);
        return;
      }

      const request: PublishReelRequest = {
        usuarioId: userId,
        video,
        descripcion,
        duracionSegundos,
        tamanoMB,
        categoriaIds,
      };

      const newReel = await publishReelService(request);

      setSuccess("¡Reel publicado exitosamente!");
      setTimeout(() => {
        router.push("/home");
      }, 1500);

      return newReel;
    } catch (err) {
      setError("No se pudo publicar el reel. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // PUT: Editar reel
  const handleEditReel = async (
    reelId: number,
    descripcion: string | undefined,
    categoriaIds: number[]
  ) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      if (categoriaIds.length === 0) {
        setError("Debes seleccionar al menos una categoría.");
        setIsLoading(false);
        return;
      }

      const request: EditReelRequest = {
        reelId,
        usuarioId: userId,
        descripcion,
        categoriaIds,
      };

      const updatedReel = await editReelService(request);

      setSuccess("Reel actualizado correctamente.");
      return updatedReel;
    } catch (err) {
      setError("No se pudo editar el reel. Intenta de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE: Eliminar reel
  const handleDeleteReel = async (reelId: number) => {
    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const request: DeleteReelRequest = {
        reelId,
        usuarioId: userId,
      };

      await deleteReelService(request);

      setSuccess("Reel eliminado correctamente.");
      return true;
    } catch (err) {
      setError("No se pudo eliminar el reel. Intenta de nuevo.");
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // GET: Cargar categorías disponibles
  const loadCategories = async () => {
    try {
      const cats = await getAllCategoriesService();
      setCategories(cats);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  return {
    categories,
    isLoading,
    error,
    success,
    loadCategories,
    handlePublishReel,
    handleEditReel,
    handleDeleteReel,
  };
}
