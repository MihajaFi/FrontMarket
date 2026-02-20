import axiosClient from "@/api/axiosClient";

export interface User {
  id: string;
  name: string;   // correspond à username dans Symfony
  email: string;
  role: "client"; // tu peux adapter si roles multiples
}

interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>("/login_check", { 
      username: email,
      password 
    });
    return data;
  },

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await axiosClient.post<AuthResponse>("/register", { 
      name,
      email,
      password 
    });
    return data;
  }
};
