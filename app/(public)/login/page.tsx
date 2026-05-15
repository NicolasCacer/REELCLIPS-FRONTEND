"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // luego aquí irá la autenticación real
    router.push("/home");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black">ReelClips</h1>

          <p className="mt-2 text-zinc-500">
            Inicia sesión para continuar
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-zinc-700"
            >
              Correo electrónico
            </label>

            <input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-zinc-700"
            >
              Contraseña
            </label>

            <input
              id="password"
              type="password"
              placeholder="********"
              className="rounded-xl border border-zinc-300 px-4 py-3 outline-none transition focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800"
          >
            Iniciar sesión
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-semibold text-black hover:underline"
          >
            Regístrate
          </Link>
        </div>
      </div>
    </main>
  );
}