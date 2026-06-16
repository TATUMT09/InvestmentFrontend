"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const roleDot: Record<string, string> = {
  superadmin: "#f43f5e",
  admin:      "#3b82f6",
  tashkilot:  "#10b981",
  user:       "#f59e0b",
};

export default function Header() {
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar, lightMode } = useUiStore();
  const { logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const dot = roleDot[user?.role || "user"];

  return (
    <>
      {(profileOpen || notifOpen) && (
        <div className="fixed inset-0 z-[1090]" onClick={() => { setProfileOpen(false); setNotifOpen(false); }} />
      )}

      <header className={cn(
        "fixed top-0 right-0 z-[1100] h-[60px] flex items-center justify-between px-5 transition-all duration-300",
        sidebarOpen ? "left-[268px]" : "left-[72px]"
      )} style={{
        background: lightMode ? "rgba(255,255,255,0.95)" : "rgba(13,21,40,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: lightMode ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.06)",
        transition: "background 0.3s ease",
      }}>

        {/* Left */}
        <button onClick={toggleSidebar}
          className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
          style={{ color: lightMode ? "#64748b" : "rgba(120,150,200,0.6)" }}
          onMouseEnter={e => { e.currentTarget.style.background = lightMode ? "#f1f5f9" : "rgba(255,255,255,0.07)"; e.currentTarget.style.color = lightMode ? "#0f172a" : "rgba(180,210,255,0.9)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = lightMode ? "#64748b" : "rgba(120,150,200,0.6)"; }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="15" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        {/* Right */}
        <div className="flex items-center gap-2">

          {/* Search */}
          <button className="hidden md:flex items-center gap-2 h-8 px-3 rounded-lg text-xs transition-all"
            style={{
              background: lightMode ? "#f1f5f9" : "rgba(255,255,255,0.04)",
              border: lightMode ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.07)",
              color: lightMode ? "#64748b" : "rgba(100,130,200,0.55)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = lightMode ? "#e2e8f0" : "rgba(255,255,255,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = lightMode ? "#f1f5f9" : "rgba(255,255,255,0.04)")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span>Qidirish...</span>
            <kbd className="ml-1 text-[10px] px-1 py-0.5 rounded"
              style={{ background: lightMode ? "#e2e8f0" : "rgba(255,255,255,0.06)", border: lightMode ? "1px solid #d1d5db" : "1px solid rgba(255,255,255,0.08)", color: lightMode ? "#94a3b8" : "rgba(100,130,200,0.45)" }}>
              ⌘K
            </kbd>
          </button>

          <div className="w-px h-5 mx-1" style={{ background: lightMode ? "#e2e8f0" : "rgba(255,255,255,0.08)" }} />

          {/* Notifications */}
          <div className="relative">
            <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
              className="relative w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
              style={{ color: "rgba(120,150,200,0.6)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                style={{ background: "#f43f5e", boxShadow: "0 0 6px #f43f5e" }} />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-11 w-80 rounded-2xl overflow-hidden z-50 anim-scale-in"
                style={{ background: lightMode ? "#ffffff" : "#111e38", border: lightMode ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: lightMode ? "1px solid #f1f5f9" : "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-sm font-semibold" style={{ color: lightMode ? "#0f172a" : "rgba(210,225,255,0.9)" }}>Bildirishnomalar</p>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}>3 yangi</span>
                </div>
                {[
                  { icon: "⚡", title: "Elektr momosi hal qilindi", time: "5 daqiqa oldin", unread: true },
                  { icon: "🔧", title: "Yangi momo yuborildi",      time: "12 daqiqa oldin", unread: true },
                  { icon: "✅", title: "Muddat belgilandi",          time: "1 soat oldin",    unread: false },
                ].map((n, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors"
                    style={{
                      background: n.unread ? (lightMode ? "#eff6ff" : "rgba(59,130,246,0.05)") : "transparent",
                      borderBottom: lightMode ? "1px solid #f8fafc" : "1px solid rgba(255,255,255,0.04)",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = lightMode ? "#f8fafc" : "rgba(255,255,255,0.05)")}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? (lightMode ? "#eff6ff" : "rgba(59,130,246,0.05)") : "transparent")}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                      style={{ background: lightMode ? "#f1f5f9" : "rgba(255,255,255,0.06)" }}>{n.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: lightMode ? "#1e293b" : "rgba(200,220,255,0.85)" }}>{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: lightMode ? "#64748b" : "rgba(100,130,200,0.5)" }}>{n.time}</p>
                    </div>
                    {n.unread && <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: "#3b82f6" }} />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-xl transition-all"
              style={{ border: "1px solid transparent" }}
              onMouseEnter={e => { e.currentTarget.style.background = lightMode ? "#f1f5f9" : "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = lightMode ? "#e2e8f0" : "rgba(255,255,255,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: `${dot}20`, border: `1px solid ${dot}40`, color: dot }}>
                {user?.ism?.[0]?.toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold leading-none" style={{ color: lightMode ? "#1e293b" : "rgba(200,220,255,0.88)" }}>{user?.ism}</p>
                <p className="text-[10px] mt-0.5 capitalize leading-none" style={{ color: lightMode ? "#64748b" : "rgba(100,130,200,0.5)" }}>{user?.role}</p>
              </div>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="ml-0.5" style={{ color: lightMode ? "#94a3b8" : "rgba(100,130,200,0.4)" }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-11 w-56 rounded-2xl overflow-hidden z-50 anim-scale-in"
                style={{ background: lightMode ? "#ffffff" : "#111e38", border: lightMode ? "1px solid #e2e8f0" : "1px solid rgba(255,255,255,0.08)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
                <div className="px-4 py-3.5" style={{ borderBottom: lightMode ? "1px solid #f1f5f9" : "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold mb-2"
                    style={{ background: `${dot}20`, border: `1px solid ${dot}40`, color: dot }}>
                    {user?.ism?.[0]?.toUpperCase()}
                  </div>
                  <p className="font-semibold text-sm" style={{ color: lightMode ? "#0f172a" : "rgba(210,225,255,0.9)" }}>{user?.ism}</p>
                  <p className="text-xs mt-0.5" style={{ color: lightMode ? "#64748b" : "rgba(100,130,200,0.5)" }}>{user?.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/profil"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors"
                    style={{ color: lightMode ? "#374151" : "rgba(150,180,255,0.7)" }}
                    onMouseEnter={(e:any) => (e.currentTarget.style.background = lightMode ? "#f8fafc" : "rgba(255,255,255,0.06)")}
                    onMouseLeave={(e:any) => (e.currentTarget.style.background = "transparent")}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    Profil
                  </Link>
                  <div className="my-1 h-px" style={{ background: lightMode ? "#f1f5f9" : "rgba(255,255,255,0.06)" }} />
                  <button onClick={() => { setProfileOpen(false); logout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "#dc2626"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#ef4444"; }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Chiqish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
