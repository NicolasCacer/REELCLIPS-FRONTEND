// features/auth/controllers/useLoginController.ts

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginService } from "../services/auth.service";
import type { LoginRequest } from "../model/auth.types";
import { useAuth } from "./authContext";

export function useLoginController() {
  const router = useRouter();
  const { setUser, rotateFeedSeed } = useAuth();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    field: keyof LoginRequest,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Debes ingresar correo y contrasena.");
      return;
    }

    try {
      setIsLoading(true);

      const usuario = await loginService(form);

      rotateFeedSeed();
      setUser({
        id: usuario.id,
        username: usuario.username,
        nombreVisualizacion:
          usuario.nombreVisualizacion ?? undefined,
        fotoPerfil: usuario.fotoPerfil ?? undefined,
      });

      router.push("/home");
    } catch {
      setError("Correo o contrasena incorrectos.");
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
