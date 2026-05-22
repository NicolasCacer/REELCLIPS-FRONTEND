"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const chats = [
  { id: "1", user: "Jorge", lastMessage: "Hola, ¿cómo vas?" },
  { id: "2", user: "Nicolas", lastMessage: "Revisemos el diseño" },
  { id: "3", user: "Daniel", lastMessage: "Ya subí los cambios" },
];

export function ChatView() {
  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      {/* Lista de chats */}
      <aside className="w-96 shrink-0 border-r border-soft/40 bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold text-primary">Chats</h1>

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

              <div className="min-w-0">
                <p className="truncate font-bold text-primary">
                  {chat.user}
                </p>
                <p className="truncate text-sm text-secondary">
                  {chat.lastMessage}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </aside>

      {/* Panel vacío cuando no hay chat seleccionado */}
      <section className="flex flex-1 items-center justify-center bg-background/40 p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-primary">
            <MessageCircle size={36} />
          </div>

          <h2 className="text-2xl font-bold text-primary">
            Selecciona un chat
          </h2>

          <p className="mt-2 text-secondary">
            Elige una conversación para ver los mensajes.
          </p>
        </div>
      </section>
    </div>
  );
}