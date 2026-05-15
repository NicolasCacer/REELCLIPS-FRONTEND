"use client";

import { AuthLayout } from "@/shared/components/AuthLayout";
import { LoginForm } from "@/features/auth/views/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Comparte momentos.
Descubre contenido.
Conecta con personas."
      subtitle="Bienvenido de nuevo"
      description="Explora reels, interactúa con la comunidad y crea contenido de manera rápida, moderna y dinámica."
    >
      <LoginForm />
    </AuthLayout>
  );
}