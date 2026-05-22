// src/app/(private)/layout.tsx
"use client";

import { usePathname } from "next/navigation";

import { HomeSidebar } from "@/features/feed/views/components/HomeSidebar";
import { useHomeFeed } from "@/features/feed/controllers/useHomeFeed";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { usuario, contactos } = useHomeFeed();

  const active =
    pathname.startsWith("/chats")
      ? "chats"
      : pathname.startsWith("/profile")
        ? "profile"
        : "home";

  return (
    <main className="fixed inset-0 flex overflow-hidden bg-background font-sans text-primary">
      <HomeSidebar
        usuario={usuario}
        contactos={contactos}
        active={active}
      />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden p-6">
        {children}
      </section>
    </main>
  );
}