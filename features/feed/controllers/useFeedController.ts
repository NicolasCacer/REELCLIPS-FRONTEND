// features/feed/controllers/useFeedController.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getFeedService,
  getAllCategoriesService,
  getCategoryService,
  filterCategoriesService,
} from "../services/feed.service";
import type { GetFeedRequest } from "../model/feed.types";
import type { ReelInfo, CategoriaInfo } from "@/shared/types/api.types";

interface UseFeedControllerProps {
  userId: number;
}

export function useFeedController({ userId }: UseFeedControllerProps) {
  const [reels, setReels] = useState<ReelInfo[]>([]);
  const [categories, setCategories] = useState<CategoriaInfo[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFeed = useCallback(
    async (page: number = 0, categoriesFilter?: string[]) => {
      try {
        setIsLoading(true);
        setError("");

        const request: GetFeedRequest = {
          usuarioId: userId,
          categorias: categoriesFilter || selectedCategories,
          pagina: page,
        };

        const feedResponse = await getFeedService(request);

        if (page === 0) {
          setReels(feedResponse.reels);
        } else {
          setReels((prev) => [...prev, ...feedResponse.reels]);
        }

        setCurrentPage(feedResponse.paginaActual);
        setTotalPages(feedResponse.totalPaginas);
        setHasMore(feedResponse.hayMas);
      } catch (err) {
        setError("No se pudo cargar el feed.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [userId, selectedCategories]
  );

  const loadCategories = useCallback(async () => {
    try {
      const cats = await getAllCategoriesService();
      setCategories(cats);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  }, []);

  const loadCategoryDetails = useCallback(async (categoryId: number) => {
    try {
      const category = await getCategoryService(categoryId);
      return category;
    } catch (err) {
      console.error("Error cargando categoría:", err);
      return null;
    }
  }, []);

  const handleFilterCategories = useCallback(
    async (categoryNames: string[]) => {
      try {
        setIsLoading(true);
        setError("");

        const filteredCategories = await filterCategoriesService(categoryNames);
        setCategories(filteredCategories);

        setCurrentPage(0);
        await loadFeed(0, categoryNames);
      } catch (err) {
        setError("No se pudo filtrar categorías.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    },
    [loadFeed]
  );

  const handleSelectCategory = (categoryName: string, isSelected: boolean) => {
    setSelectedCategories((prev) => {
      const updated = isSelected
        ? [...prev, categoryName]
        : prev.filter((c) => c !== categoryName);

      loadFeed(0, updated);
      return updated;
    });
  };

  const loadNextPage = useCallback(async () => {
    if (hasMore && !isLoading) {
      await loadFeed(currentPage + 1, selectedCategories);
    }
  }, [currentPage, hasMore, isLoading, selectedCategories, loadFeed]);

  const refreshFeed = useCallback(async () => {
    setCurrentPage(0);
    setSelectedCategories([]);
    await loadFeed(0, []);
  }, [loadFeed]);

  useEffect(() => {
    loadCategories();
    loadFeed(0, []);
  }, [loadCategories, loadFeed]);

  return {
    reels,
    categories,
    selectedCategories,
    currentPage,
    totalPages,
    hasMore,
    isLoading,
    error,
    loadFeed,
    loadCategories,
    loadCategoryDetails,
    handleFilterCategories,
    handleSelectCategory,
    loadNextPage,
    refreshFeed,
  };
}