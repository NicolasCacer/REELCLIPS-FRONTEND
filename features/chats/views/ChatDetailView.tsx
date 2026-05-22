"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, Send } from "lucide-react";

import { useChatDetailController } from "../controllers/useChatDetailController";
import { getProfileService } from "@/features/profile/services/profile.service";

type Props = {
  chatId: number;
  userId: number;
};

export function ChatDetailView({ chatId, userId }: Props) {
  const [message, setMessage] = useState("");
  const [chatName, setChatName] = useState("Chat");
  const [chatPhoto, setChatPhoto] = useState("");

  const { mensajes, isLoading, error, handleSendMessage } =
    useChatDetailController({
      conversacionId: chatId,
      userId,
    });

  useEffect(() => {
    async function loadChatName() {
      try {
        const otherUserId = 1;

        const profile = await getProfileService({
          id: otherUserId,
        });

        setChatName(
          profile.nombreVisualizacion ||
            profile.username ||
            "Usuario"
        );

        setChatPhoto(profile.fotoPerfil || "");
      } catch (error) {
        console.error(error);
        setChatName("Usuario");
        setChatPhoto("");
      }
    }

    loadChatName();
  }, [userId]);

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    await handleSendMessage(message);

    setMessage("");
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex items-center gap-4 border-b border-soft/40 bg-white px-6 py-4">
        <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary text-white">
          {chatPhoto ? (
            <img
              src={chatPhoto}
              alt={chatName}
              className="h-full w-full object-cover"
            />
          ) : (
            <MessageCircle size={22} />
          )}
        </div>

        <h1 className="text-2xl font-bold text-primary">
          {chatName}
        </h1>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-6">
        {isLoading && (
          <p className="text-secondary">
            Cargando mensajes...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {mensajes.map((msg) => {
          const mine = msg.remitenteId === userId;

          return (
            <div
              key={msg.id}
              className={`flex ${
                mine ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  mine
                    ? "bg-primary text-white"
                    : "bg-white text-primary"
                }`}
              >
                <p>{msg.contenido}</p>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex gap-3 border-t border-soft/40 bg-white p-4"
      >
        <input
          type="text"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Escribe un mensaje..."
          className="w-full rounded-2xl border border-soft px-4 py-3 outline-none transition focus:border-primary"
        />

        <button
          type="submit"
          className="rounded-2xl bg-primary px-5 text-white"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}