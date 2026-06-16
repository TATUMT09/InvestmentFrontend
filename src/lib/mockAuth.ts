import { User } from "@/types/auth.types";

interface MockUser extends User {
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    ism: "Superadmin",
    email: "superadmin@test.com",
    password: "super123",
    role: "superadmin",
    createdAt: new Date(),
  },
  {
    id: "2",
    ism: "Admin Bobur",
    email: "admin@test.com",
    password: "admin123",
    role: "admin",
    createdAt: new Date(),
  },
  {
    id: "3",
    ism: "Elektr Tashkiloti",
    email: "elektr@test.com",
    password: "tashkilot123",
    role: "tashkilot",
    createdAt: new Date(),
  },
  {
    id: "4",
    ism: "Alisher Karimov",
    email: "user@test.com",
    password: "user123",
    role: "user",
    createdAt: new Date(),
  },
];

export function mockLogin(
  email: string,
  password: string
): { user: User; token: string } | null {
  const found = MOCK_USERS.find(
    (u) => u.email === email && u.password === password
  );
  if (!found) return null;

  const { password: _, ...user } = found;
  return {
    user,
    token: `mock-token-${user.role}-${Date.now()}`,
  };
}
