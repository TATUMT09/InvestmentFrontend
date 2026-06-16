"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getProblems } from "@/services/problemService";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import type { Problem } from "@/types/api.types";

const ORG_CFG: Record<string, { label: string; icon: string; color: string; rgb: string }> = {
  GAZ:    { label: "Gaz tashkiloti",    icon: "🔥", color: "#f87171", rgb: "248,113,113" },
  SUV:    { label: "Suv tashkiloti",    icon: "💧", color: "#38bdf8", rgb: "56,189,248"  },
  ELEKTR: { label: "Elektr tashkiloti", icon: "⚡", color: "#f59e0b", rgb: "245,158,11"  },
  YOL:    { label: "Yo'l tashkiloti",   icon: "🛣️", color: "#a78bfa", rgb: "167,139,250" },
  HUJJAT: { label: "Hujjat tashkiloti", icon: "📄", color: "#94a3b8", rgb: "148,163,184" },
};

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  YANGI:      { label: "Yangi",      color: "#64748b" },
  JARAYONDA:  { label: "Jarayonda",  color: "#f59e0b" },
  HAL_ETILDI: { label: "Hal etildi", color: "#10b981" },
};

export default function TashkilotDashboard() {
  const { lightMode } = useUiStore();
  const { user }      = useAuthStore();
  const orgType       = user?.organizationType ?? "";
  const org           = ORG_CFG[orgType] ?? { label: "Tashkilot", icon: "🏢", color: "#10b981", rgb: "16,185,129" };

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const pageBg   = lightMode ? "#f0f4ff"                   : "#080d1a";
  const cardBg   = lightMode ? "#ffffff"                   : "rgba(255,255,255,0.03)";
  const cardBdr  = lightMode ? "#e2e8f0"                   : "rgba(255,255,255,0.07)";
  const txt1     = lightMode ? "#0f172a"                   : "rgba(210,225,255,0.9)";
  const txt2     = lightMode ? "#64748b"                   : "rgba(140,170,220,0.7)";
  const txt3     = lightMode ? "#94a3b8"                   : "rgba(100,130,200,0.5)";
  const heroBg   = lightMode
    ? `linear-gradient(135deg,#f0fdf4 0%,#dcfce7 50%,#eff6ff 100%)`
    : `linear-gradient(135deg,#051f15 0%,#0a2a1e 50%,#0d1528 100%)`;
  const heroBdr  = lightMode
    ? `rgba(${org.rgb},0.35)`
    : `rgba(${org.rgb},0.2)`;
  const heroLinkBg  = lightMode ? `rgba(${org.rgb},0.08)`  : `rgba(${org.rgb},0.12)`;
  const heroLinkBdr = lightMode ? `rgba(${org.rgb},0.3)`   : `rgba(${org.rgb},0.25)`;
  const badgeBg  = lightMode ? `rgba(${org.rgb},0.1)`      : `rgba(${org.rgb},0.1)`;
  const badgeBdr = lightMode ? `rgba(${org.rgb},0.3)`      : `rgba(${org.rgb},0.2)`;
  const rowBdr   = lightMode ? "rgba(0,0,0,0.06)"          : "rgba(255,255,255,0.04)";
  const rowHov   = lightMode ? "#f8faff"                   : "rgba(255,255,255,0.03)";
  const dotBg    = lightMode ? `rgba(${org.rgb},0.12)`     : `rgba(${org.rgb},0.15)`;
  const dotBdr   = lightMode ? `rgba(${org.rgb},0.3)`      : `rgba(${org.rgb},0.25)`;
  // ─────────────────────────────────────────────────────────────────────────

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getProblems()
      .then(all => {
        const mine = orgType ? all.filter(p => p.type === orgType) : all;
        setProblems(mine);
      })
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, [orgType]);

  const yangi     = problems.filter(p => p.status === "YANGI").length;
  const jarayonda = problems.filter(p => p.status === "KORIB_CHIQILMOQDA").length;
  const halEtildi = problems.filter(p => p.status === "HAL_ETILDI").length;
  const recent    = problems.filter(p => p.status !== "HAL_ETILDI").slice(0, 5);

  return (
    <div className="-m-6 p-6 min-h-screen space-y-6" style={{ background: pageBg, transition: "background 0.3s" }}>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl p-6"
        style={{ background: heroBg, border: `1px solid ${heroBdr}` }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: lightMode
            ? `radial-gradient(rgba(${org.rgb},0.07) 1px,transparent 1px)`
            : `radial-gradient(rgba(16,185,129,0.05) 1px,transparent 1px)`,
          backgroundSize: "24px 24px" }} />
        <div className="absolute -right-16 -bottom-16 w-56 h-56 pointer-events-none"
          style={{ background: `radial-gradient(circle, rgba(${org.rgb},0.1), transparent 60%)` }} />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full"
              style={{ background: badgeBg, border: `1px solid ${badgeBdr}` }}>
              <span className="text-xs font-semibold" style={{ color: org.color }}>
                {org.icon} {org.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color: txt1 }}>
              Kelgan momolar
            </h1>
            <p className="text-sm mt-1" style={{ color: txt2 }}>
              Sizga yo&apos;naltirilgan muammolarni hal qiling
            </p>
          </div>
          <Link href="/tashkilot/momolar"
            className="text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            style={{ background: heroLinkBg, border: `1px solid ${heroLinkBdr}`, color: org.color }}>
            Barchasini ko&apos;rish →
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Yangi momolar",   value: yangi,     icon: "🆕", color: "#f59e0b", sub: "Kutilmoqda"   },
          { title: "Jarayonda",       value: jarayonda, icon: "🔧", color: "#3b82f6", sub: "Bajarilmoqda" },
          { title: "Bu oy bajarildi", value: halEtildi, icon: "✅", color: "#10b981", sub: "Yakunlangan"  },
        ].map(s => (
          <div key={s.title} className="p-5 rounded-2xl"
            style={{ background: cardBg, border: `1px solid ${cardBdr}`,
              boxShadow: lightMode ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium" style={{ color: txt2 }}>{s.title}</p>
              <span className="text-xl">{s.icon}</span>
            </div>
            <p className="text-3xl font-bold" style={{ color: s.color }}>
              {loading ? "..." : s.value}
            </p>
            <p className="text-xs mt-1" style={{ color: txt3 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Status distribution ── */}
      <div className="rounded-2xl p-5"
        style={{ background: cardBg, border: `1px solid ${cardBdr}`,
          boxShadow: lightMode ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
        <p className="font-semibold text-sm mb-4" style={{ color: txt1 }}>
          Holat bo&apos;yicha taqsimot
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Jami",        count: problems.length, color: "#60a5fa" },
            { label: "Yangi keldi", count: yangi,           color: "#94a3b8" },
            { label: "Jarayonda",   count: jarayonda,       color: "#f59e0b" },
            { label: "Bajarildi",   count: halEtildi,       color: "#10b981" },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center"
              style={{ background: `${s.color}12`, border: `1px solid ${s.color}30` }}>
              <div className="flex items-center justify-center gap-1.5 mb-2">
                <span className="w-1.5 h-1.5 rounded-full"
                  style={{ background: s.color, boxShadow: `0 0 6px ${s.color}` }} />
                <p className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</p>
              </div>
              <p className="text-3xl font-bold" style={{ color: txt1 }}>
                {loading ? "..." : s.count}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Recent problems ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: cardBg, border: `1px solid ${cardBdr}`,
          boxShadow: lightMode ? "0 1px 4px rgba(0,0,0,0.06)" : "none" }}>
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: `1px solid ${cardBdr}` }}>
          <div>
            <p className="font-semibold text-sm" style={{ color: txt1 }}>
              So&apos;nggi momolar
            </p>
            <p className="text-xs mt-0.5" style={{ color: txt3 }}>
              Hal etilmagan muammolar
            </p>
          </div>
          <Link href="/tashkilot/momolar"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            style={{ color: "#60a5fa", background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(59,130,246,0.16)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(59,130,246,0.08)")}>
            Barchasini ko&apos;rish →
          </Link>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p className="text-sm animate-pulse" style={{ color: txt3 }}>Yuklanmoqda...</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="text-sm font-medium" style={{ color: "#10b981" }}>
              Barcha muammolar hal etilgan
            </p>
          </div>
        ) : (
          recent.map(p => {
            const sc = STATUS_CFG[p.status] ?? { label: p.status, color: "#94a3b8" };
            return (
              <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 transition-all"
                style={{ borderBottom: `1px solid ${rowBdr}` }}
                onMouseEnter={e => (e.currentTarget.style.background = rowHov)}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{ background: dotBg, border: `1px solid ${dotBdr}` }}>
                  {org.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: txt1 }}>
                    {p.title}
                  </p>
                  <p className="text-xs truncate" style={{ color: txt3 }}>
                    {p.projectName ?? p.project?.name ?? ""}
                    {p.createdAt ? ` · ${new Date(p.createdAt).toLocaleDateString("uz-UZ")}` : ""}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${sc.color}18`, color: sc.color, border: `1px solid ${sc.color}30` }}>
                  {sc.label}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
