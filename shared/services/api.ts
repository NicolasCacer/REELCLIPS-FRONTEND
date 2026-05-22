// shared/services/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    // Para respuestas 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async requestFormData<T>(
    endpoint: string,
    formData: FormData,
    method: "POST" | "PUT" = "POST"
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  private async requestUrlEncoded<T>(
    endpoint: string,
    params: Record<string, any>,
    method: "POST" | "PUT" | "PATCH" | "DELETE" = "POST"
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const body = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => body.append(key, item));
        } else {
          body.append(key, String(value));
        }
      }
    });

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request con JSON
  async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // POST request con form-urlencoded
  async postUrlEncoded<T>(
    endpoint: string,
    params: Record<string, any>
  ): Promise<T> {
    return this.requestUrlEncoded<T>(endpoint, params, "POST");
  }

  // POST request con FormData
  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.requestFormData<T>(endpoint, formData, "POST");
  }

  // PUT request con JSON
  async put<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request con form-urlencoded
  async putUrlEncoded<T>(
    endpoint: string,
    params: Record<string, any>
  ): Promise<T> {
    return this.requestUrlEncoded<T>(endpoint, params, "PUT");
  }

  // PUT request con FormData
  async putFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    return this.requestFormData<T>(endpoint, formData, "PUT");
  }

  // PATCH request con form-urlencoded
  async patchUrlEncoded<T>(
    endpoint: string,
    params: Record<string, any>
  ): Promise<T> {
    return this.requestUrlEncoded<T>(endpoint, params, "PATCH");
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request con form-urlencoded
  async deleteUrlEncoded<T>(
    endpoint: string,
    params?: Record<string, any>
  ): Promise<T> {
    return this.requestUrlEncoded<T>(endpoint, params || {}, "DELETE");
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // Construir URL con query parameters
  static buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => searchParams.append(key, item));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }
}

export const apiClient = new ApiClient();
