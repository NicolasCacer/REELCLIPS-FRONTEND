// src/app/(private)/chats/page.tsx

import { MessageCircle } from "lucide-react";

import { ChatLayoutView } from "@/features/chats/views/ChatLayoutView";

export default function ChatsPage() {
  return (
    <ChatLayoutView>
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-light text-primary">
            <MessageCircle size={36} />
          </div>

          <h2 className="text-2xl font-bold text-primary">
            Selecciona un chat
          </h2>

          <p className="mt-2 text-secondary">
            Escoge una conversación para comenzar.
          </p>
        </div>
      </div>
    </ChatLayoutView>
  );
}