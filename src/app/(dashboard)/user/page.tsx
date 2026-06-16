"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyProblems } from "@/services/problemService";
import { useAuthStore } from "@/store/authStore";
import type { Problem } from "@/types/api.types";

const TYPE_ICONS:  Record<string, string> = { ELEKTR:"⚡", SUV:"💧", GAZ:"🔥", YOL:"🛣️", HUJJAT:"📄", BOSHQA:"⚠️" };
const TYPE_COLORS: Record<string, string> = { ELEKTR:"#f59e0b", SUV:"#06b6d4", GAZ:"#ef4444", YOL:"#8b5cf6", HUJJAT:"#64748b", BOSHQA:"#f43f5e" };

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  YANGI:             { label: "Yuborildi",         color: "#94a3b8" },
  KORIB_CHIQILMOQDA: { label: "Ko'rib chiqilmoqda", color: "#f59e0b" },
  HAL_ETILDI:        { label: "Bajarildi",          color: "#10b981" },
};

const PARTICLES = [
  { x:10, y:20, size:2,   dur:"3.2s", del:"0s"   },
  { x:25, y:60, size:1.5, dur:"4.1s", del:"0.8s" },
  { x:40, y:15, size:3,   dur:"3.7s", del:"0.3s" },
  { x:55, y:70, size:1.5, dur:"5.0s", del:"1.2s" },
  { x:68, y:35, size:2,   dur:"3.5s", del:"0.6s" },
  { x:80, y:80, size:1,   dur:"4.5s", del:"0.1s" },
  { x:90, y:50, size:2.5, dur:"3.9s", del:"1.5s" },
];

export default function UserDashboard() {
  const { user } = useAuthStore();

  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    getMyProblems()
      .catch(() => [])
      .then(data => { setProblems(data); setLoading(false); });
  }, []);

  const total     = problems.length;
  const bajarildi = problems.filter(p => p.status === "HAL_ETILDI").length;
  const kutilmoqda = problems.filter(p => p.status !== "HAL_ETILDI").length;
  const recent    = [...problems].sort((a, b) => {
    if (!a.createdAt) return 1;
    if (!b.createdAt) return -1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  }).slice(0, 6);

  return (
    <div className="space-y-6">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden rounded-2xl p-7"
        style={{ background:"linear-gradient(135deg,#07142a 0%,#0d1f40 45%,#0a1628 100%)", border:"1px solid rgba(59,130,246,0.18)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:"radial-gradient(rgba(59,130,246,0.07) 1px,transparent 1px)", backgroundSize:"24px 24px" }} />
        <div className="absolute -top-24 -right-24 w-80 h-80 pointer-events-none rounded-full"
          style={{ background:"radial-gradient(circle, rgba(59,130,246,0.12), transparent 65%)" }} />
        <div className="absolute -bottom-16 -left-16 w-60 h-60 pointer-events-none rounded-full"
          style={{ background:"radial-gradient(circle, rgba(16,185,129,0.07), transparent 65%)" }} />
        {PARTICLES.map((p, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none anim-twinkle"
            style={{ left:`${p.x}%`, top:`${p.y}%`, width:p.size, height:p.size,
              background:"rgba(96,165,250,0.6)", boxShadow:`0 0 ${p.size*3}px rgba(59,130,246,0.8)`,
              animationDuration:p.dur, animationDelay:p.del }} />
        ))}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1.5 rounded-full"
              style={{ background:"rgba(59,130,246,0.1)", border:"1px solid rgba(59,130,246,0.2)" }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:"#10b981", boxShadow:"0 0 6px #10b981" }} />
              <span className="text-xs font-bold tracking-wide" style={{ color:"rgba(96,165,250,0.8)" }}>
                Xush kelibsiz, {user?.ism ?? "foydalanuvchi"}
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.97)" }}>
              Muammolarim holati
            </h1>
            <p className="text-sm mt-1.5" style={{ color:"rgba(120,150,200,0.55)" }}>
              Barcha yuborilgan momolar va ularning real vaqt holati
            </p>
          </div>
          <Link href="/user/momo-yuborish"
            className="shrink-0 flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl transition-all"
            style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(59,130,246,0.28)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(59,130,246,0.15)"; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Momo yuborish
          </Link>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title:"Jami momolar", val: total,     icon:"⚠️", color:"#3b82f6" },
          { title:"Bajarildi",    val: bajarildi, icon:"✅", color:"#10b981" },
          { title:"Kutilmoqda",   val: kutilmoqda,icon:"⏳", color:"#f59e0b" },
        ].map(s => (
          <div key={s.title} className="rounded-2xl p-5"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                style={{ background:`${s.color}18`, border:`1px solid ${s.color}30` }}>
                {s.icon}
              </div>
              {!loading && total > 0 && (
                <span className="text-[11px] font-semibold px-2 py-1 rounded-full"
                  style={{ background:"rgba(255,255,255,0.06)", color:"rgba(150,175,220,0.6)" }}>
                  {Math.round((s.val / total) * 100)}%
                </span>
              )}
            </div>
            <p className="text-3xl font-bold mb-1" style={{ color:"rgba(220,235,255,0.95)" }}>
              {loading ? "..." : s.val}
            </p>
            <p className="text-sm" style={{ color:"rgba(120,150,200,0.6)" }}>{s.title}</p>
          </div>
        ))}
      </div>

      {/* ── Quick actions ── */}
      <div>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color:"rgba(100,130,200,0.4)" }}>Tez amallar</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href:"/user/momo-yuborish",    icon:"📤", label:"Momo yuborish",  sub:"Yangi muammo",                       color:"#3b82f6" },
            { href:"/user/mening-momolarim", icon:"📋", label:"Momolarim",       sub: loading ? "Yuklanmoqda..." : `${total} ta momo`, color:"#10b981" },
            { href:"/user/hisobotlar",        icon:"📊", label:"Hisobotlar",      sub:"AI tahlil",                          color:"#8b5cf6" },
            { href:"/xarita",                icon:"🗺️", label:"Xarita",          sub:"Joylashuv",                          color:"#06b6d4" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="group rounded-2xl p-4 transition-all duration-200 relative overflow-hidden"
              style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background    = `${item.color}0e`;
                el.style.borderColor   = `${item.color}30`;
                el.style.transform     = "translateY(-4px)";
                el.style.boxShadow     = `0 12px 30px ${item.color}12`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.background  = "rgba(255,255,255,0.03)";
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.transform   = "translateY(0)";
                el.style.boxShadow   = "none";
              }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background:`linear-gradient(135deg, ${item.color}05, transparent 60%)` }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 transition-all duration-200 group-hover:scale-110"
                style={{ background:`${item.color}15`, border:`1px solid ${item.color}25` }}>
                {item.icon}
              </div>
              <p className="text-sm font-semibold relative z-10" style={{ color:"rgba(200,220,255,0.88)" }}>{item.label}</p>
              <p className="text-xs mt-0.5 relative z-10" style={{ color:"rgba(100,130,200,0.5)" }}>{item.sub}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── So'nggi momolar ── */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>

        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div>
            <p className="font-semibold text-sm" style={{ color:"rgba(210,225,255,0.9)" }}>So&apos;nggi momolar</p>
            <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>Eng so&apos;nggi yuborilgan muammolar</p>
          </div>
          <Link href="/user/mening-momolarim"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            style={{ color:"#60a5fa", background:"rgba(59,130,246,0.08)", border:"1px solid rgba(59,130,246,0.15)" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(59,130,246,0.16)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(59,130,246,0.08)"; }}>
            Barchasini ko&apos;rish →
          </Link>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-3 px-5 py-2.5"
          style={{ background:"rgba(255,255,255,0.02)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
          {[["Momo","col-span-7"],["Holat","col-span-2"],["Sana","col-span-3 text-right"]].map(([h,cls]) => (
            <p key={h} className={`text-[10px] font-bold tracking-widest uppercase ${cls}`}
              style={{ color:"rgba(100,130,200,0.4)" }}>{h}</p>
          ))}
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <div className="w-6 h-6 border-2 rounded-full animate-spin mx-auto mb-2"
              style={{ borderColor:"rgba(59,130,246,0.2)", borderTopColor:"#3b82f6" }} />
            <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>Yuklanmoqda...</p>
          </div>
        ) : recent.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-3xl mb-3">📋</p>
            <p className="text-sm font-medium mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Hali momo yuborilmagan</p>
            <p className="text-xs" style={{ color:"rgba(100,130,200,0.45)" }}>Birinchi muammoni yuborish uchun yuqoridagi tugmani bosing</p>
          </div>
        ) : (
          recent.map((p, i) => {
            const icon   = TYPE_ICONS[p.type]  ?? "📋";
            const tcolor = TYPE_COLORS[p.type] ?? "#64748b";
            const sc     = STATUS_CFG[p.status] ?? { label: p.status, color: "#94a3b8" };
            const date   = p.createdAt ? new Date(p.createdAt).toLocaleDateString("uz-UZ") : "—";
            return (
              <div key={p.id}
                className="grid grid-cols-12 gap-3 items-center px-5 py-3.5 transition-all duration-150 cursor-default"
                style={{ borderBottom: i < recent.length-1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background="rgba(255,255,255,0.035)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background="transparent"; }}>
                <div className="col-span-7 flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base shrink-0"
                    style={{ background:`${tcolor}18`, border:`1px solid ${tcolor}28` }}>
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold truncate" style={{ color:"rgba(200,220,255,0.88)" }}>{p.title}</p>
                      <span className="text-[10px] font-mono shrink-0" style={{ color:"rgba(100,130,200,0.4)" }}>#{p.id}</span>
                    </div>
                    <p className="text-xs truncate" style={{ color:"rgba(100,130,200,0.5)" }}>
                      {p.projectName ? `🏗️ ${p.projectName}` : ""}
                    </p>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                    style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}30` }}>
                    {sc.label}
                  </span>
                </div>
                <p className="col-span-3 text-xs text-right" style={{ color:"rgba(100,130,200,0.5)" }}>{date}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
