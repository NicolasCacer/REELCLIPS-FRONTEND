"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

import { useAuth } from "@/features/auth/controllers/authContext";
import { useChatsController } from "@/features/chats/controllers/useChatsController";

export function ChatView() {
  const { user } = useAuth();

  const {
    conversations,
    contacts,
    isLoading,
    loadingContacts,
    startConversation,
  } = useChatsController({
    userId: user?.id,
  });

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      {/* Sidebar */}
      <aside className="w-96 shrink-0 overflow-y-auto border-r border-soft/40 bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold text-primary">
          Chats
        </h1>

        {/* CONTACTOS */}
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
            Nuevos contactos
          </h2>

          <div className="flex flex-col gap-2">
            {loadingContacts ? (
              <p className="text-sm text-secondary">
                Cargando contactos...
              </p>
            ) : contacts.length === 0 ? (
              <p className="text-sm text-secondary">
                No hay usuarios disponibles.
              </p>
            ) : (
              contacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() =>
                    void startConversation(contact.id)
                  }
                  className="flex items-center gap-3 rounded-2xl border border-soft/50 p-3 text-left transition hover:border-accent hover:bg-light/20"
                >
                  {contact.fotoPerfil ? (
                    <img
                      src={contact.fotoPerfil}
                      alt={contact.username}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <MessageCircle size={20} />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-primary">
                      {contact.nombreVisualizacion ||
                        contact.username}
                    </p>

                    <p className="truncate text-sm text-secondary">
                      @{contact.username}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* CONVERSACIONES */}
        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
            Conversaciones
          </h2>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="text-sm text-secondary">
                Cargando chats...
              </p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-secondary">
                No tienes conversaciones.
              </p>
            ) : (
              conversations.map((chat) => (
                <Link
                  key={chat.id}
                  href={`/chats/${chat.id}`}
                  className="flex items-center gap-4 rounded-2xl border border-soft/60 bg-white p-4 transition hover:border-accent hover:bg-light/30"
                >
                  {chat.photo ? (
                    <img
                      src={chat.photo}
                      alt={chat.user}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      <MessageCircle size={22} />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate font-bold text-primary">
                      {chat.user}
                    </p>

                    <p className="truncate text-sm text-secondary">
                      Conversación activa
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* Empty state */}
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