// src/app/(private)/chats/[chatId]/page.tsx

import { ChatLayoutView } from "@/features/chats/views/ChatLayoutView";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({
  params,
}: ChatPageProps) {
  const { chatId } = await params;

  return (
    <ChatLayoutView>
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="border-b border-soft/40 bg-white px-6 py-4">
          <h1 className="text-2xl font-bold text-primary">
            Chat {chatId}
          </h1>
        </header>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-2xl bg-white p-4 shadow-sm">
            Mensajes del chat...
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-soft/40 bg-white p-4">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="w-full rounded-2xl border border-soft px-4 py-3 outline-none transition focus:border-primary"
          />
        </div>
      </div>
    </ChatLayoutView>
  );
}