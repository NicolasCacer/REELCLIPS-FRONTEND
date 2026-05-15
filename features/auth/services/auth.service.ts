// features/auth/services/auth.service.ts

import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../model/auth.types";

export async function loginService(
  data: LoginRequest
): Promise<LoginResponse> {
  console.log("Login request:", data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "1",
          name: "Usuario Demo",
          email: data.email,
        },
        token: "mock-token",
      });
    }, 600);
  });
}

export async function registerService(
  data: RegisterRequest
): Promise<RegisterResponse> {
  console.log("Register request:", data);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "2",
          name: data.name,
          username: data.username,
          email: data.email,
        },
        token: "mock-register-token",
      });
    }, 600);
  });
}