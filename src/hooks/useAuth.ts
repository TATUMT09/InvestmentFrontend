"use client";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, logout, hasRole } =
    useAuthStore();
  const router = useRouter();

  const redirectByRole = () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser) return router.push("/login");
    const routes: Record<string, string> = {
      superadmin:   "/superadmin",
      SUPERADMIN:   "/superadmin",
      admin:        "/admin",
      ADMIN:        "/admin",
      HOKIM:        "/hokim",
      hokim:        "/hokim",
      INVESTITSIYA: "/admin",
      investitsiya: "/admin",
      QURILISH:     "/qurilish",
      qurilish:     "/qurilish",
      tashkilot:    "/tashkilot",
      TASHKILOT:    "/tashkilot",
      TADBIRKOR:    "/user",
      tadbirkor:    "/user",
      user:         "/user",
      USER:         "/user",
      DEV:          "/dev",
      dev:          "/dev",
    };
    router.push(routes[currentUser.role] || "/login");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return { user, token, isAuthenticated, setAuth, logout: handleLogout, hasRole, redirectByRole };
}
