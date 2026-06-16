export type Role = "superadmin" | "SUPERADMIN" | "admin" | "ADMIN" | "tashkilot" | "TASHKILOT" | "user" | "USER" | "QURILISH" | "qurilish" | "HOKIM" | "hokim" | "INVESTITSIYA" | "investitsiya" | "TADBIRKOR" | "tadbirkor" | "DEV" | "dev";

export interface User {
  id: string;
  ism: string;
  email: string;
  role: Role;
  avatar?: string;
  organizationType?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
