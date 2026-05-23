"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Search,
  UserPlus,
} from "lucide-react";

import { useAuth } from "@/features/auth/controllers/authContext";
import { useChatsController } from "../controllers/useChatsController";

type ChatLayoutViewProps = {
  children: React.ReactNode;
};

export function ChatLayoutView({ children }: ChatLayoutViewProps) {
  const router = useRouter();
  const { user } = useAuth();

  const userId = user?.id;

  const [contactsOpen, setContactsOpen] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  const {
    conversations,
    contacts,
    isLoading,
    loadingContacts,
    error,
    contactsError,
    startConversation,
  } = useChatsController({
    userId,
  });

  const filteredContacts = useMemo(() => {
    const query = contactSearch.trim().toLowerCase();

    if (!query) return contacts;

    return contacts.filter((contact) => {
      const nombre = contact.nombreVisualizacion?.toLowerCase() ?? "";
      const username = contact.username?.toLowerCase() ?? "";

      return nombre.includes(query) || username.includes(query);
    });
  }, [contacts, contactSearch]);

  const handleStartConversation = async (destinatarioId: number) => {
    const conversation = await startConversation(destinatarioId);

    if (conversation?.id) {
      router.push(`/chats/${conversation.id}`);
      setContactsOpen(false);
      setContactSearch("");
    }
  };

  if (!userId) {
    return (
      <div className="flex h-full items-center justify-center text-secondary">
        Cargando usuario...
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 overflow-hidden rounded-[2rem] bg-white shadow-sm">
      <aside className="flex w-96 shrink-0 flex-col border-r border-soft/40 bg-white p-6">
        <h1 className="mb-6 text-3xl font-bold text-primary">
          Chats
        </h1>

        {/* CONVERSACIONES ARRIBA */}
        <section className="min-h-0 flex-1 overflow-y-auto pr-1">
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-secondary">
            Mis contactos
          </h2>

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
              !error &&
              conversations.length === 0 && (
                <p className="text-sm text-secondary">
                  No tienes conversaciones.
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
        </section>

        {/* AGREGAR CONTACTO ABAJO */}
        <section className="mt-5 border-t border-soft/40 pt-5">
          <button
            type="button"
            onClick={() => setContactsOpen((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-2xl border border-soft/60 bg-white px-4 py-3 text-left transition hover:border-accent hover:bg-light/30"
          >
            <span className="flex items-center gap-3 font-bold text-primary">
              <UserPlus size={20} />
              Agregar contacto
            </span>

            {contactsOpen ? (
              <ChevronUp size={20} className="text-secondary" />
            ) : (
              <ChevronDown size={20} className="text-secondary" />
            )}
          </button>

          {contactsOpen && (
            <div className="mt-4 rounded-2xl border border-soft/50 bg-white p-3">
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-soft/60 px-3 py-2">
                <Search size={18} className="text-secondary" />

                <input
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Buscar por nombre..."
                  className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-secondary"
                />
              </div>

              <div className="max-h-72 overflow-y-auto">
                {loadingContacts && (
                  <p className="px-2 py-3 text-sm text-secondary">
                    Cargando contactos...
                  </p>
                )}

                {contactsError && (
                  <p className="px-2 py-3 text-sm text-red-500">
                    {contactsError}
                  </p>
                )}

                {!loadingContacts &&
                  !contactsError &&
                  filteredContacts.length === 0 && (
                    <p className="px-2 py-3 text-sm text-secondary">
                      No se encontraron contactos.
                    </p>
                  )}

                {!loadingContacts &&
                  filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      type="button"
                      onClick={() =>
                        void handleStartConversation(contact.id)
                      }
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left transition hover:bg-light/40"
                    >
                      <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-light text-primary">
                        {contact.fotoPerfil ? (
                          <img
                            src={contact.fotoPerfil}
                            alt={
                              contact.nombreVisualizacion ||
                              contact.username ||
                              "Usuario"
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <UserPlus size={18} />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-primary">
                          {contact.nombreVisualizacion ||
                            contact.username ||
                            "Usuario"}
                        </p>

                        <p className="truncate text-xs text-secondary">
                          {contact.username?.startsWith("@")
                            ? contact.username
                            : `@${contact.username}`}
                        </p>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </section>
      </aside>

      <section className="flex min-w-0 flex-1 bg-background/40">
        {children}
      </section>
    </div>
  );
}