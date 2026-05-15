"use client";

import { AuthLayout } from "@/shared/components/AuthLayout";
import { RegisterForm } from "@/features/auth/views/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crea tu cuenta.
      Publica tus reels.
      Únete a la comunidad."
      subtitle="Crear cuenta"
      description="Regístrate para compartir contenido, interactuar con otros usuarios y descubrir nuevos momentos dentro de ReelClips."
    >
      <RegisterForm />
    </AuthLayout>
  );
}