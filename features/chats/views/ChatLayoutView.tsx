// src/features/chats/views/ChatLayoutView.tsx
"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

type ChatLayoutViewProps = {
  children: React.ReactNode;
};

const chats = [
  { id: "1", user: "Jorge" },
  { id: "2", user: "Nicolas" },
  { id: "3", user: "Daniel" },
];

export function ChatLayoutView({
  children,
}: ChatLayoutViewProps) {
  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      {/* Sidebar de chats */}
      <aside className="w-96 shrink-0 border-r border-soft/40 bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold text-primary">
          Chats
        </h1>

        <div className="flex flex-col gap-3">
          {chats.map((chat) => (
            <Link
              key={chat.id}
              href={`/chats/${chat.id}`}
              className="flex items-center gap-4 rounded-2xl border border-soft/60 bg-white p-4 transition hover:border-accent hover:bg-light/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <MessageCircle size={22} />
              </div>

              <div>
                <p className="font-bold text-primary">
                  {chat.user}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Contenido dinámico */}
      <section className="flex min-w-0 flex-1 bg-background/40">
        {children}
      </section>
    </div>
  );
}