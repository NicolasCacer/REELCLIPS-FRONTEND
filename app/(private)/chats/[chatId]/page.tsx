// src/app/(private)/chats/[chatId]/page.tsx

import { ChatLayoutView } from "@/features/chats/views/ChatLayoutView";
import { ChatDetailView } from "@/features/chats/views/ChatDetailView";

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
      <ChatDetailView
        chatId={Number(chatId)}
      />
    </ChatLayoutView>
  );
}