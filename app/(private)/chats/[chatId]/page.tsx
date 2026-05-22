// src/app/(private)/chats/[chatId]/page.tsx

import { ChatLayoutView } from "@/features/chats/views/ChatLayoutView";
import { ChatDetailView } from "@/features/chats/views/ChatDetailView";

type ChatPageProps = {
  params: Promise<{
    chatId: string;
  }>;
};

export default async function ChatPage({ params }: ChatPageProps) {
  const { chatId } = await params;

  // Cámbialo por tu auth real.
  const userId = 1;

  return (
    <ChatLayoutView>
      <ChatDetailView chatId={Number(chatId)} userId={userId} />
    </ChatLayoutView>
  );
}