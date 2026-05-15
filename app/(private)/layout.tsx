// src/app/(private)/layout.tsx

import Link from "next/link";
import { Clapperboard } from "lucide-react";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-light p-6">
      <div className="flex min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        
        {/* Sidebar */}
        <aside className="flex w-72 flex-col border-r border-soft/40 bg-white px-6 py-8">
          
          {/* Logo */}
          <div className="mb-10 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white">
              <Clapperboard size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-primary">
                ReelClips
              </h1>

              <p className="text-sm text-secondary">
                Social video platform
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-3">
            <Link
              href="/home"
              className="rounded-2xl px-4 py-3 font-semibold text-secondary transition-all hover:bg-soft/30 hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/profile"
              className="rounded-2xl px-4 py-3 font-semibold text-secondary transition-all hover:bg-soft/30 hover:text-primary"
            >
              Profile
            </Link>

            <Link
              href="/chats"
              className="rounded-2xl px-4 py-3 font-semibold text-secondary transition-all hover:bg-soft/30 hover:text-primary"
            >
              Chats
            </Link>

            <Link
              href="/publish"
              className="rounded-2xl px-4 py-3 font-semibold text-secondary transition-all hover:bg-soft/30 hover:text-primary"
            >
              Publish
            </Link>
          </nav>

          {/* Bottom section */}
          <div className="mt-auto rounded-3xl bg-primary p-5 text-white">
            <h2 className="text-lg font-bold">
              Bienvenido 👋
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/75">
              Explora reels, conversa con otros usuarios y comparte contenido.
            </p>
          </div>
        </aside>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto bg-background/40 p-8">
          <div className="min-h-full rounded-[1.5rem] bg-white p-8 shadow-sm">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}