// features/auth/controllers/useRegisterController.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerService } from "../services/auth.service";
import type { RegisterRequest } from "../model/auth.types";

export function useRegisterController() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterRequest>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof RegisterRequest, value: string) => {
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

      const response = await registerService(form);

      localStorage.setItem("reelclips_token", response.token);
      localStorage.setItem("reelclips_user", JSON.stringify(response.user));

      router.push("/home");
    } catch {
      setError("No se pudo crear la cuenta. Intenta nuevamente.");
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