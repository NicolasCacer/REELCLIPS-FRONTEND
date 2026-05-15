// features/auth/views/LoginForm.tsx

"use client";

import Link from "next/link";
import { useLoginController } from "../controllers/useLoginController";

export function LoginForm() {
  const { form, error, isLoading, handleChange, handleLogin } =
    useLoginController();

  return (
    <>
      <p className="mb-8 text-base leading-7 text-secondary">
        Inicia sesión para continuar explorando contenido.
      </p>

      <form onSubmit={handleLogin} className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="email" className="text-sm font-semibold text-primary">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
            className="rounded-2xl border border-soft bg-white px-5 py-4 text-base text-primary outline-none transition-all placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-4">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-primary"
            >
              Contraseña
            </label>

            <button
              type="button"
              className="text-sm font-semibold text-secondary transition hover:text-primary"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="********"
            className="rounded-2xl border border-soft bg-white px-5 py-4 text-base text-primary outline-none transition-all placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-3 rounded-2xl bg-secondary py-4 text-base font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:bg-primary hover:shadow-xl hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-10 text-center text-base text-secondary">
        ¿No tienes cuenta?{" "}
        <Link
          href="/register"
          className="font-bold text-primary transition hover:text-accent"
        >
          Regístrate
        </Link>
      </p>
    </>
  );
}