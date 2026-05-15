// src/app/(private)/profile/page.tsx

"use client";

import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    // luego aquí irá limpiar token/sesión
    router.push("/login");
  };

  return (
    <main className="flex min-h-full flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold text-black">
        Profile
      </h1>

      <button
        onClick={handleLogout}
        className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </main>
  );
}