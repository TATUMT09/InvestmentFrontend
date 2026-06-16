"use client";
import { useState, useEffect } from "react";
import { getMe } from "@/services/authService";
import type { MeProfile } from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";

const ROLE_CFG: Record<string, { label: string; color: string }> = {
  SUPERADMIN:   { label: "Superadmin",    color: "#f43f5e" },
  superadmin:   { label: "Superadmin",    color: "#f43f5e" },
  ADMIN:        { label: "Admin",         color: "#3b82f6" },
  admin:        { label: "Admin",         color: "#3b82f6" },
  HOKIM:        { label: "Hokim",         color: "#f43f5e" },
  INVESTITSIYA: { label: "Investitsiya",  color: "#3b82f6" },
  QURILISH:     { label: "Qurilish",      color: "#8b5cf6" },
  TASHKILOT:    { label: "Tashkilot",     color: "#10b981" },
  TADBIRKOR:    { label: "Tadbirkor",     color: "#f59e0b" },
  USER:         { label: "Foydalanuvchi", color: "#f59e0b" },
};
const rc = (r: string) => ROLE_CFG[r] ?? { label: r, color: "#64748b" };

export default function ProfilPage() {
  const { logout } = useAuth();
  const [profile,  setProfile]  = useState<MeProfile | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    getMe()
      .then(setProfile)
      .catch(() => setError("Ma'lumotlarni yuklashda xato"))
      .finally(() => setLoading(false));
  }, []);

  const role = profile ? rc(profile.role) : { label: "—", color: "#64748b" };
  const initials = profile?.fullName
    ?.split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  if (loading) {
    return (
      <div className="-m-6 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 60px)", background: "#080d1a" }}>
        <div className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor: "rgba(59,130,246,0.2)", borderTopColor: "#3b82f6" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="-m-6 flex items-center justify-center"
        style={{ minHeight: "calc(100vh - 60px)", background: "#080d1a" }}>
        <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight: "calc(100vh - 60px)", background: "#080d1a" }}>

      {/* Page header */}
      <div className="px-6 pt-6 pb-4 flex-shrink-0">
        <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-2"
          style={{ background: "rgba(59,130,246,0.18)", border: "1px solid rgba(59,130,246,0.3)", color: "#60a5fa" }}>
          PROFIL
        </span>
        <h1 className="text-xl font-bold" style={{ color: "rgba(220,235,255,0.97)" }}>Mening profilim</h1>
        <p className="text-xs mt-0.5" style={{ color: "rgba(100,130,200,0.55)" }}>
          Hisob ma&apos;lumotlari — /auth/me
        </p>
      </div>

      <div className="px-6 pb-6 space-y-4 flex-1">

        {/* Avatar banner */}
        <div className="rounded-2xl p-6 flex items-center gap-5 relative overflow-hidden"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 80% at 0% 50%, ${role.color}12 0%, transparent 70%)` }} />

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold z-10 relative"
              style={{
                background: `${role.color}20`,
                border: `2px solid ${role.color}50`,
                boxShadow: `0 0 28px ${role.color}25`,
                color: role.color,
              }}>
              {initials}
            </div>
            <span className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center z-20"
              style={{ background: "#10b981", borderColor: "#080d1a" }}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
          </div>

          {/* Name & meta */}
          <div className="flex-1 min-w-0 z-10">
            <h2 className="text-xl font-bold truncate" style={{ color: "rgba(220,235,255,0.97)" }}>
              {profile?.fullName}
            </h2>
            <p className="text-sm mt-0.5 font-mono" style={{ color: "rgba(120,150,200,0.55)" }}>
              @{profile?.username}
            </p>
            <div className="mt-3 flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-xl text-xs font-bold"
                style={{ background: `${role.color}20`, border: `1px solid ${role.color}40`, color: role.color }}>
                {role.label}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-medium"
                style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981" }}>
                Faol
              </span>
            </div>
          </div>

          {/* ID */}
          <div className="flex-shrink-0 text-right z-10">
            <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: "rgba(100,130,200,0.4)" }}>ID</p>
            <p className="text-3xl font-bold font-mono" style={{ color: `${role.color}60` }}>
              #{profile?.id}
            </p>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow
            icon="person"
            label="To'liq ism"
            value={profile?.fullName ?? "—"}
            color="#3b82f6"
          />
          <InfoRow
            icon="phone"
            label="Telefon"
            value={profile?.phone ?? "—"}
            color="#10b981"
          />
          <InfoRow
            icon="user"
            label="Username"
            value={`@${profile?.username}`}
            color="#8b5cf6"
          />
          <InfoRow
            icon="shield"
            label="Rol"
            value={role.label}
            color={role.color}
          />
          <InfoRow
            icon="building"
            label="Bo'lim"
            value={profile?.department ?? "Belgilanmagan"}
            color="#f59e0b"
            muted={!profile?.department}
          />
          <InfoRow
            icon="tag"
            label="Tashkilot turi"
            value={profile?.organizationType ?? "Belgilanmagan"}
            color="#06b6d4"
            muted={!profile?.organizationType}
          />
        </div>

        {/* Logout */}
        <div className="pt-2">
          <button onClick={logout}
            className="flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.2)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
            }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Tizimdan chiqish
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── InfoRow ── */
const ICONS: Record<string, React.ReactNode> = {
  person:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  phone:    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.58 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.29 6.29l1.41-1.41a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  user:     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  shield:   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  building: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  tag:      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
};

function InfoRow({ icon, label, value, color, muted = false }: {
  icon: string; label: string; value: string; color: string; muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}28`, color }}>
        {ICONS[icon]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold tracking-widest" style={{ color: "rgba(100,130,200,0.4)" }}>
          {label.toUpperCase()}
        </p>
        <p className="text-sm font-semibold mt-0.5 truncate"
          style={{ color: muted ? "rgba(100,130,200,0.3)" : "rgba(210,230,255,0.9)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
