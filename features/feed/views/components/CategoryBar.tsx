// src/features/feed/views/components/CategoryBar.tsx
"use client";

type CategoryBarProps = {
  categorias: string[];
  activa: string | null;
  onSelect: (nombre: string) => void;
};

export function CategoryBar({ categorias, activa, onSelect }: CategoryBarProps) {
  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1">
      {categorias.map((nombre, i) => {
        const isActive = activa === nombre;
        return (
          <button
            key={`${nombre}-${i}`}
            type="button"
            onClick={() => onSelect(nombre)}
            className={[
              "flex shrink-0 items-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-sm font-semibold transition-colors",
              isActive
                ? "border-primary bg-primary text-white"
                : "border-soft/70 bg-white text-primary hover:border-accent hover:bg-light/30",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold",
                isActive ? "bg-white/20 text-white" : "bg-light/60 text-secondary",
              ].join(" ")}
            >
              {nombre.charAt(0).toUpperCase()}
            </span>
            {nombre}
          </button>
        );
      })}
    </div>
  );
}