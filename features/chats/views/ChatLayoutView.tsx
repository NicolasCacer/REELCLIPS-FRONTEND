// src/features/chats/views/ChatLayoutView.tsx
"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { getConversationMessagesService } from "../services/chat.service";

import { getProfileService } from "@/features/profile/services/profile.service";

type ChatLayoutViewProps = {
  children: React.ReactNode;
};

type ChatPreview = {
  id: string;
  user: string;
};

export function ChatLayoutView({
  children,
}: ChatLayoutViewProps) {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadChats() {
      try {
        setIsLoading(true);

        /**
         * TEMPORAL:
         * conversación fija
         */
        const messages =
          await getConversationMessagesService({
            conversacionId: 1,
            usuarioId: 2,
          });

        if (messages.length === 0) return;

        const lastMessage =
          messages[messages.length - 1];

        /**
         * Obtener nombre real del usuario
         */
        const profile =
          await getProfileService({
            id: lastMessage.remitenteId,
          });

        setChats([
          {
            id: String(lastMessage.conversacionId),
            user:
              profile.nombreVisualizacion ||
              profile.username,
          },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadChats();
  }, []);

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      {/* Sidebar */}
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

          {!isLoading &&
            chats.map((chat) => (
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

      {/* Contenido */}
      <section className="flex min-w-0 flex-1 bg-background/40">
        {children}
      </section>
    </div>
  );
}