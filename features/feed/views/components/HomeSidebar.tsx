// src/features/feed/views/components/HomeSidebar.tsx
"use client";

import Link from "next/link";
import { Home, MessageCircle, Plus } from "lucide-react";

import { Avatar } from "./Avatar";
import type { HomeContacto } from "@/features/feed/controllers/useHomeFeed";
import type { UsuarioInfo } from "@/shared/types/api.types";

type HomeSidebarProps = {
  usuario: UsuarioInfo | null;
  contactos?: HomeContacto[];
  active?: "home" | "chats" | "profile";
};

// Contactos de marcador de posición (el backend de contactos no está expuesto).
const CONTACTOS_DEMO: HomeContacto[] = [
  { id: 1, nombre: "Pepito Peréz", fotoPerfil: null },
  { id: 2, nombre: "Pepito Peréz", fotoPerfil: null },
];

export function HomeSidebar({ usuario, contactos, active = "home" }: HomeSidebarProps) {
  const nombre = usuario?.nombreVisualizacion || usuario?.username || "Jorge";
  const handle = usuario?.username ? `@${usuario.username}` : "@jjal";
  const lista = contactos ?? CONTACTOS_DEMO;

  const navBase =
    "flex items-center gap-3 rounded-2xl border-2 px-4 py-3 font-semibold transition-colors";
  const navActivo = "border-primary bg-primary text-white";
  const navInactivo = "border-soft/70 text-primary hover:border-accent hover:bg-light/30";

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-8 border-r border-soft/40 bg-white px-6 py-7">
      {/* Perfil (enlace a tu propio perfil) */}
      <Link
        href="/profile"
        className={[
          "flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-light/30",
          active === "profile" ? "bg-light/40 ring-1 ring-accent/40" : "",
        ].join(" ")}
      >
        <Avatar nombre={nombre} src={usuario?.fotoPerfil} size={56} />
        <div className="min-w-0">
          <p className="truncate text-xl font-bold leading-tight text-primary">{nombre}</p>
          <p className="truncate text-sm text-secondary">{handle}</p>
        </div>
      </Link>

      {/* Navegación */}
      <nav className="flex flex-col gap-3">
        <Link
          href="/home"
          aria-current={active === "home" ? "page" : undefined}
          className={[navBase, active === "home" ? navActivo : navInactivo].join(" ")}
        >
          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full",
              active === "home" ? "bg-white/20" : "bg-light/60 text-secondary",
            ].join(" ")}
          >
            <Home size={16} />
          </span>
          Home
        </Link>

        <Link
          href="/chats"
          aria-current={active === "chats" ? "page" : undefined}
          className={[navBase, active === "chats" ? navActivo : navInactivo].join(" ")}
        >
          <span
            className={[
              "flex h-7 w-7 items-center justify-center rounded-full",
              active === "chats" ? "bg-white/20" : "bg-light/60 text-secondary",
            ].join(" ")}
          >
            <MessageCircle size={16} />
          </span>
          Chats
        </Link>
      </nav>

      {/* Contactos */}
      <div className="flex min-h-0 flex-1 flex-col">
        <h2 className="mb-3 text-base font-bold text-primary">Mis Contactos</h2>
        <ul className="flex flex-col gap-1 overflow-y-auto pr-1">
          {lista.map((c, i) => (
            <li key={`${c.id}-${i}`}>
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-light/30"
              >
                <Avatar nombre={c.nombre} src={c.fotoPerfil} size={40} ring={false} />
                <span className="truncate text-sm font-medium text-secondary">{c.nombre}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Botón flotante para crear / publicar */}
      <Link
        href="/publish"
        aria-label="Crear publicación"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-105 hover:bg-secondary"
      >
        <Plus size={26} strokeWidth={3} />
      </Link>
    </aside>
  );
}