import Link from "next/link";

export default function ChatsPage() {
  const chats = [
    { id: "1", user: "Jorge" },
    { id: "2", user: "Nicolas" },
    { id: "3", user: "Daniel" },
  ];

  return (
    <main className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold text-black">
        Chats
      </h1>

      <div className="flex flex-col gap-3">
        {chats.map((chat) => (
          <Link
            key={chat.id}
            href={`/chats/${chat.id}`}
            className="rounded-xl border border-zinc-300 bg-white p-4 text-black shadow-sm transition hover:bg-zinc-100"
          >
            Chat con {chat.user}
          </Link>
        ))}
      </div>
    </main>
  );
}