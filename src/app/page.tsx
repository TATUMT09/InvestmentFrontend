"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const ROLE_ROUTES: Record<string, string> = {
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
};

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    redirected.current = true;

    if (!isAuthenticated || !user) {
      router.replace("/login");
      return;
    }
    router.replace(ROLE_ROUTES[user.role] ?? "/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
