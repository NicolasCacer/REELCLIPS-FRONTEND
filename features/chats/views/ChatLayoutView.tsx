"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { useAuth } from "@/features/auth/controllers/authContext";
import { useChatsController } from "../controllers/useChatsController";

type ChatLayoutViewProps = {
  children: React.ReactNode;
};

export function ChatLayoutView({ children }: ChatLayoutViewProps) {
  const { user } = useAuth();

  const userId = user?.id;

  const {
    conversations,
    isLoading,
    error,
  } = useChatsController({
    userId: userId ?? 0,
  });

  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center text-secondary">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <aside className="w-96 shrink-0 border-r border-soft/40 bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold text-primary">
          Chats
        </h1>

        <div className="flex flex-col gap-3">
          {isLoading && (
            <p className="text-secondary">
              Cargando chats...
            </p>
          )}

          {error && (
            <p className="text-red-500">
              {error}
            </p>
          )}

          {!isLoading &&
            conversations.map((chat) => (
              <Link
                key={chat.id}
                href={`/chats/${chat.conversacionId}`}
                className="flex items-center gap-4 rounded-2xl border border-soft/60 bg-white p-4 transition hover:border-accent hover:bg-light/30"
              >
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary text-white">
                  {chat.photo ? (
                    <img
                      src={chat.photo}
                      alt={chat.user}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <MessageCircle size={22} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate font-bold text-primary">
                    {chat.user}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 bg-background/40">
        {children}
      </section>
    </div>
  );
}