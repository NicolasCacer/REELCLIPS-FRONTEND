// src/app/(private)/layout.tsx

import Link from "next/link";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-100">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-zinc-200 bg-white p-6">
        <h1 className="mb-10 text-3xl font-bold text-black">
          ReelClips
        </h1>

        <nav className="flex flex-col gap-3">
          <Link
            href="/home"
            className="rounded-xl px-4 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/profile"
            className="rounded-xl px-4 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-black"
          >
            Profile
          </Link>

          <Link
            href="/chats"
            className="rounded-xl px-4 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-black"
          >
            Chats
          </Link>

          <Link
            href="/publish"
            className="rounded-xl px-4 py-3 font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-black"
          >
            Publish
          </Link>
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}