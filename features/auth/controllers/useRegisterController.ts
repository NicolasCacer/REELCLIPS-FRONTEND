// features/auth/controllers/useRegisterController.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerService } from "../services/auth.service";

export function useRegisterController() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (
      !form.name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Debes completar todos los campos.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setIsLoading(true);

      // SOLO enviar lo que el backend necesita
      const usuario = await registerService({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      localStorage.setItem(
        "reelclips_user",
        JSON.stringify(usuario)
      );

      localStorage.setItem(
        "reelclips_user_id",
        String(usuario.id)
      );

      router.push("/home");
    } catch {
      setError(
        "No se pudo crear la cuenta. El correo o username podrían ya existir."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    handleChange,
    handleRegister,
  };
}