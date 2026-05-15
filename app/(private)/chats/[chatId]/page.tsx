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
    <main className="flex min-h-full items-center justify-center">
      <h1 className="text-4xl font-bold text-black">
        Chat {chatId}
      </h1>
    </main>
  );
}