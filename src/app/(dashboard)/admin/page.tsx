"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getDashboardStats } from "@/services/dashboardService";
import { getProblems } from "@/services/problemService";
import type { DashboardStats, Problem } from "@/types/api.types";
import { useUiStore } from "@/store/uiStore";

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

const VILOYATLAR = ["Barcha viloyatlar","Toshkent","Samarqand","Farg'ona","Namangan","Andijon","Buxoro","Xorazm"];

function timeAgo(dateStr?: string): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 60) return `${min} daqiqa oldin`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} soat oldin`;
  return `${Math.floor(h / 24)} kun oldin`;
}

export default function AdminDashboard() {
  const { lightMode } = useUiStore();

  // Theme tokens
  const BG   = lightMode ? "#f8fafc"            : "#080d1a";
  const CARD = lightMode ? "#ffffff"            : "rgba(255,255,255,0.04)";
  const CARD_BORDER = lightMode ? "#e2e8f0"    : "rgba(255,255,255,0.08)";
  const TXT  = lightMode ? "#0f172a"            : "rgba(220,235,255,0.97)";
  const TXT2 = lightMode ? "#64748b"            : "rgba(100,130,200,0.55)";
  const HDR  = lightMode ? "#f1f5f9"            : "rgba(255,255,255,0.06)";
  const HDR_B= lightMode ? "#e2e8f0"            : "rgba(255,255,255,0.1)";
  const SIDE_BG = lightMode ? "#ffffff"         : "rgba(255,255,255,0.03)";
  const SIDE_B  = lightMode ? "#e2e8f0"         : "rgba(255,255,255,0.07)";
  const LINK_BG = lightMode ? "#f8fafc"         : "rgba(255,255,255,0.03)";
  const LINK_HV = lightMode ? "#f1f5f9"         : "rgba(255,255,255,0.07)";
  const LINK_B  = lightMode ? "#e2e8f0"         : "rgba(255,255,255,0.05)";
  const PROB_TXT= lightMode ? "#1e293b"         : "rgba(210,225,255,0.9)";
  const PROB_T2 = lightMode ? "#64748b"         : "rgba(100,130,200,0.55)";
  const PROB_T3 = lightMode ? "#94a3b8"         : "rgba(100,130,200,0.4)";
  const BADGE_BG= lightMode ? "#eff6ff"         : "rgba(59,130,246,0.18)";
  const BADGE_B = lightMode ? "#bfdbfe"         : "rgba(59,130,246,0.3)";
  const BADGE_C = lightMode ? "#1d4ed8"         : "#60a5fa";
  const SKEL   = lightMode ? "#e2e8f0"          : "rgba(255,255,255,0.08)";

  const [viloyat,  setViloyat]  = useState("Barcha viloyatlar");
  const [stats,    setStats]    = useState<DashboardStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [s, p] = await Promise.all([
          getDashboardStats("INVESTITSIYA"),
          getProblems(),
        ]);
        setStats(s);
        setProblems(p.slice(0, 5));
      } catch {
        // fallback — davom etadi
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const STATS = [
    { label:"Jami obyektlar",                   val: stats?.totalProjects ?? 0,  change:"+0", color:"#3b82f6", sub:"Barchasi",                link:true  },
    { label:"Jarayonda",                          val: stats?.jarayonda    ?? 0,  change:"+0", color:"#f59e0b", sub:"Ish olib borilmoqda",      link:false },
    { label:"Tugallangan",                        val: stats?.tugallangan  ?? 0,  change:"+0", color:"#10b981", sub:"Topshirilgan",             link:false },
    { label:"Muammoli",                           val: stats?.muammoli     ?? 0,  change:"+0", color:"#eab308", sub:"Diqqat talab etadi",       link:false },
    { label:"Shartnoma muddati o'tgan",           val: stats?.kechikkan    ?? 0,  change:"+0", color:"#ef4444", sub:"E'tibor talab etadi",      link:false },
  ];


  return (
    <div className="-m-6 flex flex-col" style={{ minHeight:"calc(100vh - 60px)", background:BG }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between flex-shrink-0">
        <div>
          <span className="inline-block text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-lg mb-2"
            style={{ background:BADGE_BG, border:`1px solid ${BADGE_B}`, color:BADGE_C }}>
            01 DASHBOARD
          </span>
          <h1 className="text-xl font-bold" style={{ color:TXT }}>Investitsiya Dashboard</h1>
          <p className="text-xs mt-1" style={{ color:TXT2 }}>Umumiy holat va tezkor ma&apos;lumotlar</p>
        </div>

        <div className="flex items-center gap-2.5 mt-1">
          <select value={viloyat} onChange={e=>setViloyat(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-medium outline-none cursor-pointer appearance-none"
            style={{ background:HDR, border:`1px solid ${HDR_B}`, color:TXT }}>
            {VILOYATLAR.map(v=><option key={v} value={v}>{v}</option>)}
          </select>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs"
            style={{ background:HDR, border:`1px solid ${HDR_B}`, color:TXT2 }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            24-apr-2026 &ndash; 24-may-2026
          </div>
          <button className="relative w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:HDR, border:`1px solid ${HDR_B}` }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={TXT2} strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {problems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background:"#ef4444", color:"#fff" }}>{problems.length}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4 grid grid-cols-5 gap-3 flex-shrink-0">
        {STATS.map((s, i) => (
          <div key={i} className="relative p-4 rounded-2xl overflow-hidden"
            style={{ background:CARD, border:`1px solid ${CARD_BORDER}` }}>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
              style={{ background:`radial-gradient(circle, ${s.color}14 0%, transparent 70%)`, transform:"translate(35%,-35%)" }} />
            <p className="text-[11px] font-medium mb-3 leading-snug pr-2"
              style={{ color:TXT2 }}>{s.label}</p>
            <div className="flex items-end justify-between">
              {loading
                ? <div className="w-12 h-8 rounded-lg animate-pulse" style={{ background:SKEL }} />
                : <span className="text-[32px] font-bold leading-none" style={{ color:TXT }}>{s.val}</span>
              }
            </div>
            {s.link
              ? <Link href="/investitsiya/obyektlar" className="text-[11px] font-semibold mt-1.5 block" style={{ color:s.color }}>{s.sub} →</Link>
              : <p className="text-[11px] mt-1.5" style={{ color:`${s.color}aa` }}>{s.sub}</p>
            }
          </div>
        ))}
      </div>

      {/* Map + Problems */}
      <div className="px-6 pb-6 flex gap-4 flex-1 min-h-0">
        <div className="flex-1 rounded-2xl overflow-hidden" style={{ border:`1px solid ${CARD_BORDER}` }}>
          <InvestMap />
        </div>

        <div className="w-[300px] flex flex-col rounded-2xl p-4 flex-shrink-0"
          style={{ background:SIDE_BG, border:`1px solid ${SIDE_B}` }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color:TXT }}>So&apos;nggi muammolar</p>
            <Link href="/investitsiya/muammolar" className="text-xs font-semibold" style={{ color:"#3b82f6" }}>Barchasi →</Link>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="h-14 rounded-xl animate-pulse" style={{ background:SKEL }} />
              ))}
            </div>
          ) : problems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-center" style={{ color:TXT2 }}>Muammolar yo&apos;q</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto scrollbar-hide">
              {problems.map(p => {
                const icon  = PROBLEM_ICONS[p.type]  ?? "⚠️";
                const color = PROBLEM_COLORS[p.type] ?? "#64748b";
                return (
                  <Link key={p.id} href="/investitsiya/muammolar"
                    className="flex items-start gap-3 p-3 rounded-xl transition-all"
                    style={{ background:LINK_BG, border:`1px solid ${LINK_B}` }}
                    onMouseEnter={e=>(e.currentTarget.style.background=LINK_HV)}
                    onMouseLeave={e=>(e.currentTarget.style.background=LINK_BG)}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background:`${color}20`, border:`1px solid ${color}30` }}>
                      {icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold leading-snug" style={{ color:PROB_TXT }}>{p.title}</p>
                      <p className="text-[10px] mt-0.5 truncate" style={{ color:PROB_T2 }}>
                        {p.projectName ?? p.project?.name ?? p.department ?? p.responsibleDepartment}
                      </p>
                    </div>
                    <p className="text-[10px] flex-shrink-0 mt-0.5 whitespace-nowrap" style={{ color:PROB_T3 }}>
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
