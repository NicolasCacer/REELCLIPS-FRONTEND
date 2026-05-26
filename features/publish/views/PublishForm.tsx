// features/publish/views/PublishForm.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { UploadCloud, Film, X } from "lucide-react";

import { useAuth } from "@/features/auth/controllers/authContext";
import { usePublishController } from "../controllers/usePublishController";

const MAX_DURACION_SEGUNDOS = 90;
const MAX_TAMANO_MB = 500;
const MAX_DESCRIPCION = 500;

export function PublishForm() {
  const { user } = useAuth();

  if (!user?.id) {
    return (
      <div className="flex flex-1 items-center justify-center text-secondary">
        Cargando usuario...
      </div>
    );
  }

  return <PublishFormContent userId={user.id} />;
}

function PublishFormContent({ userId }: { userId: number }) {
  const {
    categories,
    isLoading,
    error,
    success,
    loadCategories,
    handlePublishReel,
  } = usePublishController({ userId });

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [duracionSegundos, setDuracionSegundos] = useState(0);
  const [tamanoMB, setTamanoMB] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [categoriaIds, setCategoriaIds] = useState<number[]>([]);
  const [localError, setLocalError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cargar categorías al montar
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Liberar el object URL al desmontar o al cambiar de video
  useEffect(() => {
    return () => {
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [videoPreview]);

  const resetVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoFile(null);
    setVideoPreview(null);
    setDuracionSegundos(0);
    setTamanoMB(0);
  };

  const onSelectVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError("");

    if (!file.type.startsWith("video/")) {
      setLocalError("El archivo debe ser un video (mp4).");
      return;
    }

    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_TAMANO_MB) {
      setLocalError(`El video supera el máximo de ${MAX_TAMANO_MB} MB.`);
      return;
    }

    if (videoPreview) URL.revokeObjectURL(videoPreview);
    const url = URL.createObjectURL(file);

    // Leer la duración real del video desde sus metadatos
    const probe = document.createElement("video");
    probe.preload = "metadata";
    probe.onloadedmetadata = () => {
      const dur = Number.isFinite(probe.duration)
        ? Math.round(probe.duration)
        : 0;
      setDuracionSegundos(dur);
      if (dur > MAX_DURACION_SEGUNDOS) {
        setLocalError(
          `El video dura ${dur}s. El máximo permitido es ${MAX_DURACION_SEGUNDOS}s.`
        );
      }
    };
    probe.src = url;

    setVideoFile(file);
    setVideoPreview(url);
    setTamanoMB(Number(sizeMB.toFixed(2)));
  };

  const toggleCategoria = (id: number) => {
    setCategoriaIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!videoFile) {
      setLocalError("Selecciona un video para publicar.");
      return;
    }
    if (duracionSegundos <= 0) {
      setLocalError("Espera a que se procese el video o usa otro archivo.");
      return;
    }
    if (duracionSegundos > MAX_DURACION_SEGUNDOS) {
      setLocalError(
        `El video supera el máximo de ${MAX_DURACION_SEGUNDOS} segundos.`
      );
      return;
    }
    if (categoriaIds.length === 0) {
      setLocalError("Selecciona al menos una categoría.");
      return;
    }

    await handlePublishReel(
      videoFile,
      descripcion.trim() || undefined,
      duracionSegundos,
      tamanoMB,
      categoriaIds
    );
  };

  const mensajeError = localError || error;

  return (
    <div className="mx-auto flex h-full w-full max-w-2xl flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Publicar reel</h1>
        <p className="mt-1 text-secondary">
          Sube tu video, escribe una descripción y asígnale una o más categorías.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-6 overflow-y-auto rounded-3xl bg-white p-6 shadow-sm"
      >
        {/* Zona de carga / preview */}
        {!videoPreview ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-soft/70 bg-light/20 px-6 py-12 text-center transition hover:border-accent hover:bg-light/40"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
              <UploadCloud size={26} />
            </span>
            <span className="font-semibold text-primary">
              Haz clic para seleccionar un video
            </span>
            <span className="text-sm text-secondary">
              MP4 · máx. {MAX_DURACION_SEGUNDOS}s · máx. {MAX_TAMANO_MB} MB
            </span>
          </button>
        ) : (
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative aspect-[9/16] w-40 shrink-0 overflow-hidden rounded-2xl bg-primary">
              <video
                src={videoPreview}
                className="h-full w-full object-cover"
                controls
                playsInline
              />
              <button
                type="button"
                onClick={resetVideo}
                aria-label="Quitar video"
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col justify-center gap-1 text-sm text-secondary">
              <p className="flex items-center gap-2 font-semibold text-primary">
                <Film size={16} /> {videoFile?.name}
              </p>
              <p>Duración: {duracionSegundos}s</p>
              <p>Tamaño: {tamanoMB} MB</p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/*"
          onChange={onSelectVideo}
          className="hidden"
        />

        {/* Descripción */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-primary">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            maxLength={MAX_DESCRIPCION}
            rows={3}
            placeholder="Cuenta de qué trata tu reel..."
            className="resize-none rounded-2xl border border-soft/60 bg-background/40 px-4 py-3 text-sm text-primary outline-none transition focus:border-accent"
          />
          <span className="self-end text-xs text-secondary">
            {descripcion.length}/{MAX_DESCRIPCION}
          </span>
        </div>

        {/* Categorías */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-primary">
            Categorías <span className="text-secondary">(al menos una)</span>
          </label>

          {categories.length === 0 ? (
            <p className="text-sm text-secondary">Cargando categorías...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const activa = categoriaIds.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategoria(cat.id)}
                    className={[
                      "rounded-2xl border-2 px-4 py-2 text-sm font-semibold transition-colors",
                      activa
                        ? "border-primary bg-primary text-white"
                        : "border-soft/70 bg-white text-primary hover:border-accent hover:bg-light/30",
                    ].join(" ")}
                  >
                    {cat.nombre}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Mensajes */}
        {mensajeError && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {mensajeError}
          </p>
        )}
        {success && (
          <p className="rounded-2xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </p>
        )}

        {/* Acción */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-auto rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Publicando..." : "Publicar reel"}
        </button>
      </form>
    </div>
  );
}