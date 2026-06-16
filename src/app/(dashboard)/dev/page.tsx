"use client";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";

export default function DevDashboardPage() {
  const { user } = useAuthStore();
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold" style={{ color:"rgba(220,235,255,0.95)" }}>
          Dev Panel
        </h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Xush kelibsiz, {user?.ism || "Dev"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <Link href="/dev/userlar"
          className="flex items-center gap-4 p-5 rounded-2xl transition-all"
          style={{ background:"rgba(6,182,212,0.08)", border:"1px solid rgba(6,182,212,0.2)" }}
          onMouseEnter={e=>(e.currentTarget.style.background="rgba(6,182,212,0.14)")}
          onMouseLeave={e=>(e.currentTarget.style.background="rgba(6,182,212,0.08)")}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ background:"rgba(6,182,212,0.12)" }}>
            👥
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color:"rgba(220,235,255,0.9)" }}>Userlar boshqaruvi</p>
            <p className="text-xs mt-0.5" style={{ color:"rgba(120,150,200,0.55)" }}>
              Ko'rish, tahrirlash, parol tiklash
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
