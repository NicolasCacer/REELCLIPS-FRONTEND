// features/auth/views/RegisterForm.tsx

"use client";

import Link from "next/link";
import { useRegisterController } from "../controllers/useRegisterController";

export function RegisterForm() {
  const { form, error, isLoading, handleChange, handleRegister } =
    useRegisterController();

  return (
    <>
      <p className="mb-7 text-base leading-7 text-secondary">
        Completa tus datos para crear tu cuenta en ReelClips.
      </p>

      <form onSubmit={handleRegister} className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm font-semibold text-primary">
            Nombre
          </label>

          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Tu nombre"
            className="rounded-2xl border border-soft px-4 py-3 text-primary outline-none transition placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="username"
            className="text-sm font-semibold text-primary"
          >
            Usuario
          </label>

          <input
            id="username"
            type="text"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
            placeholder="@usuario"
            className="rounded-2xl border border-soft px-4 py-3 text-primary outline-none transition placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="email" className="text-sm font-semibold text-primary">
            Correo electrónico
          </label>

          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="correo@ejemplo.com"
            className="rounded-2xl border border-soft px-4 py-3 text-primary outline-none transition placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-primary"
          >
            Contraseña
          </label>

          <input
            id="password"
            type="password"
            value={form.password}
            onChange={(e) => handleChange("password", e.target.value)}
            placeholder="********"
            className="rounded-2xl border border-soft px-4 py-3 text-primary outline-none transition placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-primary"
          >
            Confirmar
          </label>

          <input
            id="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            placeholder="********"
            className="rounded-2xl border border-soft px-4 py-3 text-primary outline-none transition placeholder:text-secondary/50 focus:border-accent focus:ring-4 focus:ring-soft/40"
          />
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 sm:col-span-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 rounded-2xl bg-secondary py-3 font-bold text-white shadow-lg shadow-secondary/20 transition hover:bg-primary hover:shadow-xl hover:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2"
        >
          {isLoading ? "Creando cuenta..." : "Crear cuenta"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-secondary">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-bold text-primary transition hover:text-accent"
        >
          Inicia sesión
        </Link>
      </p>
    </>
  );
}