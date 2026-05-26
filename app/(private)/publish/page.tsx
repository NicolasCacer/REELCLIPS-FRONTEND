"use client";

import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useAuth } from "@/features/auth/controllers/authContext";
import { usePublishController } from "@/features/publish/controllers/usePublishController";
import type { VideoMetadata } from "@/features/publish/model/publish.types";
import { createCategoryService } from "@/features/feed/services/feed.service";

function extractVideoMetadata(file: File): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const tempVideo = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    tempVideo.preload = "metadata";
    tempVideo.onloadedmetadata = () => {
      URL.revokeObjectURL(objectUrl);

      const duracionSegundos = Math.max(1, Math.round(tempVideo.duration));
      const tamanoMB = Number((file.size / (1024 * 1024)).toFixed(2));

      resolve({
        duracionSegundos,
        tamanoMB,
        nombreArchivo: file.name,
      });
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("No se pudieron leer los metadatos del video."));
    };

    tempVideo.src = objectUrl;
  });
}

export default function PublishPage() {
  const { user } = useAuth();
  const userId = user?.id ?? 0;

  const {
    categories,
    isLoading,
    error,
    success,
    loadCategories,
    handlePublishReel,
  } = usePublishController({ userId });

  const [video, setVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState("");
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [showCreateCategoryForm, setShowCreateCategoryForm] = useState(false);

  const [localError, setLocalError] = useState("");
  const [localSuccess, setLocalSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    void loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(
    () => () => {
      if (videoPreviewUrl) {
        URL.revokeObjectURL(videoPreviewUrl);
      }
    },
    [videoPreviewUrl]
  );

  const disabledPublish = useMemo(
    () =>
      isLoading ||
      !user?.id ||
      !video ||
      !videoMetadata ||
      selectedCategoryIds.length === 0,
    [isLoading, selectedCategoryIds.length, user?.id, video, videoMetadata]
  );

  const handleVideoSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }

    setVideo(selectedFile);
    setVideoMetadata(null);
    setLocalError("");
    setVideoPreviewUrl(selectedFile ? URL.createObjectURL(selectedFile) : null);

    if (!selectedFile) {
      return;
    }

    try {
      const metadata = await extractVideoMetadata(selectedFile);
      setVideoMetadata(metadata);
    } catch {
      setLocalError("No se pudo calcular la informacion del archivo.");
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCreateCategory = async () => {
    setLocalError("");
    setLocalSuccess("");

    const nombre = newCategoryName.trim();
    const descripcionNueva = newCategoryDescription.trim();

    if (!nombre) {
      setLocalError("El nombre de la categoria es obligatorio.");
      return;
    }

    if (!descripcionNueva) {
      setLocalError("La descripcion de la categoria es obligatoria.");
      return;
    }

    try {
      setIsCreatingCategory(true);
      const newCategory = await createCategoryService(nombre, descripcionNueva);
      setSelectedCategoryIds((prev) =>
        prev.includes(newCategory.id) ? prev : [...prev, newCategory.id]
      );
      setNewCategoryName("");
      setNewCategoryDescription("");
      setShowCreateCategoryForm(false);
      setLocalSuccess("Categoria creada y seleccionada.");
      await loadCategories();
    } catch {
      setLocalError("No se pudo crear la categoria.");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handlePublish = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLocalError("");
    setLocalSuccess("");

    if (!user?.id) {
      setLocalError("Debes iniciar sesion para publicar.");
      return;
    }

    if (!video || !videoMetadata) {
      setLocalError("Debes cargar un archivo de video valido.");
      return;
    }

    await handlePublishReel(
      video,
      descripcion.trim() || undefined,
      videoMetadata.duracionSegundos,
      videoMetadata.tamanoMB,
      selectedCategoryIds
    );
  };

  return (
    <main className="relative mx-auto flex h-full w-full max-w-5xl flex-col overflow-y-auto pb-8">
      <div className="pointer-events-none absolute top-20 right-8 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <form onSubmit={handlePublish} className="relative z-10 grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <aside className="space-y-4 lg:sticky lg:top-4 lg:self-start">
          <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 shadow-lg shadow-primary/10 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-soft/40 px-5 py-4">
              <h2 className="text-sm font-bold uppercase tracking-wide text-primary">
                Preview
              </h2>
            </div>

            <div className="p-3">
              <div className="relative mx-auto aspect-[9/16] w-full max-w-[240px] overflow-hidden rounded-3xl border border-soft/40 bg-primary">
                {videoPreviewUrl ? (
                  <video
                    src={videoPreviewUrl}
                    controls
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-b from-primary via-secondary to-accent p-6 text-center">
                    <p className="text-sm font-semibold text-white/90">
                      Tu previsualizacion aparecera aqui cuando cargues el video
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-soft/60 bg-white/90 p-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Duracion
              </p>
              <p className="mt-1 text-base font-bold text-primary">
                {videoMetadata?.duracionSegundos ?? "-"} s
              </p>
            </div>
            <div className="rounded-2xl border border-soft/60 bg-white/90 p-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Tamano
              </p>
              <p className="mt-1 text-base font-bold text-primary">
                {videoMetadata?.tamanoMB ?? "-"} MB
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-soft/60 bg-white/90 p-3 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-secondary">
                Archivo
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-primary">
                {videoMetadata?.nombreArchivo ?? "Ningun archivo seleccionado"}
              </p>
            </div>
          </section>
        </aside>

        <section className="rounded-3xl border border-white/80 bg-white/90 p-5 shadow-lg shadow-primary/10 backdrop-blur-sm sm:p-6">
          <div className="grid gap-5">
            <div className="space-y-3">
              <label htmlFor="video" className="text-sm font-bold text-primary">
                Archivo de video
              </label>
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoSelect}
                className="sr-only"
              />
              <label
                htmlFor="video"
                className="group block cursor-pointer rounded-2xl border-2 border-dashed border-soft bg-gradient-to-br from-light/30 to-white p-4 transition hover:border-accent hover:from-light/40"
              >
                <p className="text-base font-semibold text-primary">
                  Arrastra tu video o haz click para seleccionarlo
                </p>
                <p className="mt-1 text-sm text-secondary">
                  Formatos soportados por tu navegador para previsualizacion.
                </p>
              </label>
            </div>

            <div className="space-y-3">
              <label htmlFor="descripcion" className="text-sm font-bold text-primary">
                Descripcion
              </label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(event) => setDescripcion(event.target.value)}
                rows={5}
                placeholder="Cuenta que tiene de especial este reel..."
                className="w-full rounded-2xl border border-soft bg-white px-4 py-3 text-primary outline-none transition placeholder:text-secondary/60 focus:border-accent focus:ring-4 focus:ring-soft/40"
              />
            </div>

            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-sm font-bold text-primary">Categorias</h2>
                <button
                  type="button"
                  onClick={() =>
                    setShowCreateCategoryForm((previousValue) => !previousValue)
                  }
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:bg-secondary"
                >
                  <span className="text-sm leading-none">+</span>
                  Nueva categoria
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const selected = selectedCategoryIds.includes(category.id);

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                        selected
                          ? "border-primary bg-primary text-white shadow-md shadow-primary/20"
                          : "border-soft bg-white text-secondary hover:border-accent hover:text-primary"
                      }`}
                    >
                      {category.nombre}
                    </button>
                  );
                })}
              </div>
            </section>

            {showCreateCategoryForm && (
              <section className="rounded-2xl border border-soft/70 bg-background/70 p-4">
                <h2 className="mb-3 text-sm font-bold text-primary">Crear categoria</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(event) => setNewCategoryName(event.target.value)}
                    placeholder="Nombre"
                    className="rounded-xl border border-soft bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-soft/40"
                  />
                  <input
                    type="text"
                    value={newCategoryDescription}
                    onChange={(event) =>
                      setNewCategoryDescription(event.target.value)
                    }
                    placeholder="Descripcion"
                    className="rounded-xl border border-soft bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent focus:ring-4 focus:ring-soft/40"
                  />
                  <div className="sm:col-span-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => void handleCreateCategory()}
                      disabled={isCreatingCategory}
                      className="flex-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isCreatingCategory ? "Creando..." : "Crear categoria"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateCategoryForm(false)}
                      className="rounded-xl border border-soft bg-white px-4 py-2 text-sm font-semibold text-secondary transition hover:border-accent hover:text-primary"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </section>
            )}

            {(localError || error) && (
              <p className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {localError || error}
              </p>
            )}

            {(localSuccess || success) && (
              <p className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {localSuccess || success}
              </p>
            )}

            <button
              type="submit"
              disabled={disabledPublish}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-secondary to-primary py-3 text-base font-bold text-white shadow-lg shadow-secondary/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading && (
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden="true"
                />
              )}
              {isLoading ? "Publicando..." : "Publicar reel"}
            </button>
          </div>
        </section>
      </form>
    </main>
  );
}
