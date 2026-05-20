// src/features/feed/views/components/Avatar.tsx
"use client";

type AvatarProps = {
  nombre?: string | null;
  src?: string | null;
  size?: number; // px
  ring?: boolean;
  className?: string;
};

/**
 * Avatar circular. Muestra la foto si existe; si no, la inicial del nombre
 * sobre un fondo de la paleta.
 */
export function Avatar({ nombre, src, size = 44, ring = true, className = "" }: AvatarProps) {
  const inicial = (nombre?.trim()?.[0] ?? "?").toUpperCase();
  const dimension = { width: size, height: size };

  return (
    <span
      style={dimension}
      className={[
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        ring ? "ring-2 ring-soft/60" : "",
        "bg-light/60 text-primary",
        className,
      ].join(" ")}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={nombre ?? "avatar"} className="h-full w-full object-cover" />
      ) : (
        <span
          className="font-semibold"
          style={{ fontSize: Math.max(12, Math.round(size * 0.4)) }}
        >
          {inicial}
        </span>
      )}
    </span>
  );
}