// features/auth/controllers/useLoginController.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "../services/auth.service";
import type { LoginRequest } from "../model/auth.types";

export function useLoginController() {
  const router = useRouter();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field: keyof LoginRequest, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Debes ingresar correo y contraseña.");
      return;
    }

    try {
      setIsLoading(true);

      const usuario = await loginService(form);

      localStorage.setItem("reelclips_user", JSON.stringify(usuario));
      localStorage.setItem("reelclips_user_id", String(usuario.id));

      router.push("/home");
    } catch {
      setError("Correo o contraseña incorrectos.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    error,
    isLoading,
    handleChange,
    handleLogin,
  };
}