"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getDashboardStats } from "@/services/dashboardService";
import { getProblems } from "@/services/problemService";
import type { DashboardStats, Problem } from "@/types/api.types";

const InvestMap = dynamic(() => import("@/components/map/InvestMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center rounded-2xl"
      style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)" }}>
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor:"rgba(59,130,246,0.2)", borderTopColor:"#3b82f6" }} />
    </div>
  ),
});

const PROBLEM_ICONS: Record<string, string> = {
  ELEKTR:"⚡", SUV:"💧", GAZ:"🔥", YOL:"🛣️", HUJJAT:"📄",
};
const PROBLEM_COLORS: Record<string, string> = {
  ELEKTR:"#f59e0b", SUV:"#06b6d4", GAZ:"#ef4444", YOL:"#8b5cf6", HUJJAT:"#64748b",
};

const LEGEND = [
  { label:"Jarayonda",       color:"#f59e0b" },
  { label:"Tugatirilgan",    color:"#10b981" },
  { label:"Muammoli",        color:"#ef4444" },
  { label:"Rejalashtirilgan",color:"#6b7280" },
];

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min} daqiqa oldin`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

export default function QurilishDashboard() {
  const [stats,    setStats]    = useState<DashboardStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          getDashboardStats("QURILISH"),
          getProblems(),
        ]);
        setStats(s);
        setProblems(p.slice(0, 5));
      } catch {
        // davom etadi
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STATS = [
    { label:"Jami obyektlar",     val: stats?.totalProjects ?? 0, color:"#3b82f6", sub:"Barchasi",                link:true  },
    { label:"Jarayonda",           val: stats?.jarayonda    ?? 0, color:"#f59e0b", sub:"Ish olib borilmoqda",     link:false },
    { label:"Tugallangan",         val: stats?.tugallangan  ?? 0, color:"#10b981", sub:"Topshirilgan",            link:false },
    { label:"Muammoli",            val: stats?.muammoli     ?? 0, color:"#ef4444", sub:"E'tibor talab etadi",     link:false },
    { label:"Kechikkan",           val: stats?.kechikkan    ?? 0, color:"#eab308", sub:"Muddat o'tgan",           link:false },
  ];

  return (
    <div className="-m-6 flex flex-col" style={{ minHeight:"calc(100vh - 60px)", background:"#080d1a" }}>

      {/* ── HEADER ── */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-2"
            style={{ background:"rgba(59,130,246,0.18)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}>
            01 QURILISH
          </span>
          <h1 className="text-xl font-bold" style={{ color:"rgba(220,235,255,0.97)" }}>
            Qurilish Dashboard
          </h1>
          <p className="text-xs mt-1" style={{ color:"rgba(100,130,200,0.55)" }}>
            Qurilish obyektlarining umumiy holati
          </p>
        </div>

        <div className="flex items-center gap-2.5 mt-1">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"rgba(180,200,255,0.7)" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            24-apr-2026 &ndash; 24-may-2026
          </div>

          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
            style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}
            onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.1)")}
            onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.06)")}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(180,200,255,0.7)" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {problems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background:"#ef4444", color:"#fff" }}>{problems.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="px-6 pb-4 grid grid-cols-5 gap-3 flex-shrink-0">
        {STATS.map((s, i) => (
          <div key={i} className="relative p-4 rounded-2xl overflow-hidden"
            style={{ background:"rgba(255,255,255,0.04)", border:`1px solid ${s.color}22` }}>

            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
              style={{ background:`radial-gradient(circle, ${s.color}14 0%, transparent 70%)`, transform:"translate(35%,-35%)" }} />

            <p className="text-[11px] font-medium mb-3 leading-snug pr-2"
              style={{ color:"rgba(140,165,220,0.65)" }}>{s.label}</p>

            <div className="flex items-end justify-between">
              {loading
                ? <div className="w-12 h-8 rounded-lg animate-pulse" style={{ background:"rgba(255,255,255,0.08)" }} />
                : <span className="text-[32px] font-bold leading-none" style={{ color:"rgba(220,235,255,0.97)" }}>{s.val}</span>
              }
            </div>

            {s.link
              ? <Link href="/investitsiya/obyektlar" className="text-[11px] font-semibold mt-1.5 block" style={{ color:s.color }}>{s.sub} →</Link>
              : <p className="text-[11px] mt-1.5" style={{ color:`${s.color}aa` }}>{s.sub}</p>
            }
          </div>
        ))}
      </div>

      {/* ── MAP + PROBLEMS ── */}
      <div className="px-6 pb-6 flex gap-4 flex-1 min-h-0">

        {/* Map */}
        <div className="flex-1 flex flex-col rounded-2xl overflow-hidden"
          style={{ border:"1px solid rgba(255,255,255,0.07)" }}>

          <div className="px-4 py-3 flex-shrink-0 flex items-center justify-between"
            style={{ borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.03)" }}>
            <p className="text-sm font-semibold" style={{ color:"rgba(210,225,255,0.85)" }}>
              Qurilish obyektlarining joylashuvi
            </p>
          </div>

          <div className="flex-1 min-h-0">
            <InvestMap />
          </div>

          <div className="px-4 py-3 flex items-center gap-5 flex-shrink-0"
            style={{ borderTop:"1px solid rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.02)" }}>
            {LEGEND.map(l => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background:l.color, boxShadow:`0 0 6px ${l.color}60` }} />
                <span className="text-[11px]" style={{ color:"rgba(160,185,230,0.6)" }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* So'nggi muammolar */}
        <div className="w-[300px] flex flex-col rounded-2xl p-4 flex-shrink-0"
          style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>

          <div className="flex items-center justify-between mb-4 flex-shrink-0">
            <p className="text-sm font-bold" style={{ color:"rgba(220,235,255,0.92)" }}>
              So&apos;nggi muammolar
            </p>
            <Link href="/investitsiya/muammolar" className="text-xs font-semibold" style={{ color:"#60a5fa" }}>
              Barchasi →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background:"rgba(255,255,255,0.05)" }} />
              ))}
            </div>
          ) : problems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-center" style={{ color:"rgba(100,130,200,0.4)" }}>Muammolar yo&apos;q</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto scrollbar-hide">
              {problems.map(p => {
                const icon  = PROBLEM_ICONS[p.type]  ?? "⚠️";
                const color = PROBLEM_COLORS[p.type] ?? "#64748b";
                return (
                  <Link key={p.id} href="/investitsiya/muammolar"
                    className="flex items-start gap-3 p-3 rounded-xl transition-all"
                    style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e=>(e.currentTarget.style.background="rgba(255,255,255,0.07)")}
                    onMouseLeave={e=>(e.currentTarget.style.background="rgba(255,255,255,0.03)")}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background:`${color}20`, border:`1px solid ${color}30` }}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug" style={{ color:"rgba(210,225,255,0.9)" }}>{p.title}</p>
                      <p className="text-[10px] mt-0.5 truncate" style={{ color:"rgba(100,130,200,0.55)" }}>
                        {p.projectName ?? p.project?.name ?? p.department ?? p.responsibleDepartment}
                      </p>
                    </div>
                    <p className="text-[10px] flex-shrink-0 mt-0.5 whitespace-nowrap" style={{ color:"rgba(100,130,200,0.4)" }}>
                      {timeAgo(p.createdAt)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
