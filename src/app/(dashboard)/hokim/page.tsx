"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getDashboardStats } from "@/services/dashboardService";
import { getProblems } from "@/services/problemService";
import { getProjects } from "@/services/projectService";
import type { DashboardStats, Problem, Project } from "@/types/api.types";
import AiTahlilBlock from "@/components/hisobot/AiTahlilBlock";

const InvestMap = dynamic(() => import("@/components/map/InvestMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center" style={{ background:"#081526" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor:"rgba(201,168,76,0.15)", borderTopColor:"#c9a84c" }} />
        <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.15em", color:"rgba(201,168,76,0.5)" }}>
          YUKLANMOQDA
        </p>
      </div>
    </div>
  ),
});

const NAVY  = "#0d1f3c";
const NAVYD = "#081526";
const GOLD  = "#c9a84c";
const GOLDL = "#e2c06a";
const CREAM = "#faf7f0";

const PROB_STYLE: Record<string, { icon:string; color:string; bg:string }> = {
  ELEKTR: { icon:"⚡", color:"#fbbf24", bg:"rgba(251,191,36,0.12)"  },
  SUV:    { icon:"💧", color:"#38bdf8", bg:"rgba(56,189,248,0.12)"  },
  GAZ:    { icon:"🔥", color:"#f87171", bg:"rgba(248,113,113,0.12)" },
  YOL:    { icon:"🛣️", color:"#a78bfa", bg:"rgba(167,139,250,0.12)" },
  HUJJAT: { icon:"📄", color:"#94a3b8", bg:"rgba(148,163,184,0.12)" },
};

type Tab = "INVESTITSIYA" | "QURILISH";

const STATS = [
  { key:"totalProjects", label:"Jami loyiha",  color:GOLD,      link:true  },
  { key:"jarayonda",     label:"Jarayonda",     color:"#60a5fa", link:false },
  { key:"tugallangan",   label:"Tugallangan",   color:"#34d399", link:false },
  { key:"muammoli",      label:"Muammoli",      color:"#f87171", link:false },
  { key:"kechikkan",     label:"Kechikkan",     color:"#fbbf24", link:false },
] as const;

const LEGEND = [
  { label:"Yangi",       color:"#38bdf8" },
  { label:"Jarayonda",   color:"#60a5fa" },
  { label:"Tugallangan", color:"#34d399" },
  { label:"Muammoli",    color:"#f87171" },
  { label:"Kechikkan",   color:"#fbbf24" },
];

function timeAgo(d?: string) {
  if (!d) return "";
  const min = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (min < 60) return `${min} daq oldin`;
  const h = Math.floor(min / 60);
  return h < 24 ? `${h} soat oldin` : `${Math.floor(h/24)} kun oldin`;
}

/* ── Glass style helper ── */
const glass = (border = "rgba(255,255,255,0.1)"): React.CSSProperties => ({
  background: "rgba(6,12,28,0.92)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: `1px solid ${border}`,
  boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
});

export default function HokimDashboard() {
  const [tab,      setTab]      = useState<Tab>("INVESTITSIYA");
  const [loading,  setLoading]  = useState(true);
  const [iStats,   setIStats]   = useState<DashboardStats | null>(null);
  const [qStats,   setQStats]   = useState<DashboardStats | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [today,    setToday]    = useState("");

  useEffect(() => {
    const d = new Date();
    const M = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
    setToday(`${d.getDate()} ${M[d.getMonth()]} ${d.getFullYear()}`);
    (async () => {
      try {
        const [is, qs, p] = await Promise.all([
          getDashboardStats("INVESTITSIYA"),
          getDashboardStats("QURILISH"),
          getProblems(),
        ]);
        setIStats(is); setQStats(qs);
        setProblems(p.slice(0, 10));
      } catch { /* skip */ }
      finally { setLoading(false); }
    })();
  }, []);

  useEffect(() => {
    getProjects({ type: tab }).then(setProjects).catch(() => setProjects([]));
  }, [tab]);

  const stats      = tab === "INVESTITSIYA" ? iStats : qStats;
  const tabColor   = tab === "INVESTITSIYA" ? "#60a5fa" : "#a78bfa";
  const tabGlow    = tab === "INVESTITSIYA" ? "rgba(96,165,250,0.3)" : "rgba(167,139,250,0.3)";
  const tabLabel   = tab === "INVESTITSIYA" ? "Investitsiya" : "Qurilish";
  const obyektLink = tab === "INVESTITSIYA" ? "/investitsiya/obyektlar" : "/qurilish/obyektlar";

  return (
    <div className="-m-6 flex flex-col"
      style={{ height:"calc(100vh - 60px)", background:NAVYD, overflow:"hidden", position:"relative" }}>

      {/* Dot texture */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0,
        backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize:"30px 30px" }} />

      {/* Glows */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0,
        background:`radial-gradient(ellipse 55% 35% at 75% 0%, ${GOLD}0d, transparent),
                    radial-gradient(ellipse 35% 45% at 0% 100%, ${NAVY}bb, transparent)` }} />

      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ zIndex:10, height:2,
        background:`linear-gradient(90deg, transparent, ${GOLD}cc 30%, ${GOLDL} 50%, ${GOLD}cc 70%, transparent)` }} />

      {/* ══ HEADER ══ */}
      <div className="relative flex-shrink-0" style={{ zIndex:5, height:56,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        padding:"0 18px",
        borderBottom:`1px solid rgba(201,168,76,0.14)`,
        background:"rgba(6,12,28,0.7)", backdropFilter:"blur(10px)" }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:38, height:38, borderRadius:11, flexShrink:0,
            display:"flex", alignItems:"center", justifyContent:"center",
            background:`linear-gradient(135deg, ${GOLD}25, ${GOLD}0c)`,
            border:`1.5px solid ${GOLD}50` }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M2 17l10 5 10-5" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round"/>
              <path d="M2 12l10 5 10-5" stroke={GOLD} strokeWidth="1.6" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:1 }}>
              <span style={{ fontSize:9, fontWeight:800, letterSpacing:"0.2em", color:GOLD,
                background:`${GOLD}18`, border:`1px solid ${GOLD}40`, borderRadius:5, padding:"2px 7px" }}>
                HOKIM PANELI
              </span>
              <span style={{ fontSize:11, color:"rgba(255,255,255,0.3)" }}>{today}</span>
            </div>
            <p style={{ fontSize:13, fontWeight:700, color:CREAM, margin:0, letterSpacing:"-0.01em" }}>
              Umumiy ko&apos;rinish
            </p>
          </div>
        </div>

        {/* Right: loyalty counts + bell */}
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          {([["INVESTITSIYA", iStats, "#60a5fa", "📊"], ["QURILISH", qStats, "#a78bfa", "🏗️"]] as const).map(
            ([t, s, c, emoji]) => (
              <div key={t} style={{ display:"flex", alignItems:"center", gap:6,
                padding:"5px 13px", borderRadius:9, fontSize:12, fontWeight:600,
                background:"rgba(255,255,255,0.06)", border:`1px solid ${c}28`, color:c }}>
                <span>{emoji}</span>
                <span>{loading ? "—" : (s?.totalProjects ?? 0)} loyiha</span>
              </div>
            )
          )}
          <button style={{ width:36, height:36, borderRadius:9, flexShrink:0, position:"relative",
            display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {problems.length > 0 && (
              <span style={{ position:"absolute", top:-3, right:-3, width:16, height:16,
                borderRadius:"50%", fontSize:9, fontWeight:800,
                background:"#ef4444", color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                {problems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="relative flex-1 min-h-0 flex" style={{ zIndex:1, gap:0 }}>

        {/* ════ MAP (full height, no padding) ════ */}
        <div className="flex-1 relative" style={{ overflow:"hidden" }}>

          {/* Corner accents */}
          {[false,true].flatMap(isRight => [false,true].map(isBot => (
            <div key={`${isRight}-${isBot}`} style={{ position:"absolute", zIndex:10, pointerEvents:"none",
              ...(isRight ? { right:0 } : { left:0 }),
              ...(isBot   ? { bottom:0 } : { top:0 }),
              width:40, height:40 }}>
              <div style={{ position:"absolute",
                ...(isBot ? { bottom:0 } : { top:0 }),
                ...(isRight ? { right:0 } : { left:0 }),
                width:28, height:2,
                background:`linear-gradient(${isRight?"270":"90"}deg, ${GOLD}cc, transparent)` }} />
              <div style={{ position:"absolute",
                ...(isBot ? { bottom:0 } : { top:0 }),
                ...(isRight ? { right:0 } : { left:0 }),
                width:2, height:28,
                background:`linear-gradient(${isBot?"0":"180"}deg, ${GOLD}cc, transparent)` }} />
            </div>
          )))}

          {/* Map */}
          <div style={{ position:"absolute", inset:0 }}>
            <InvestMap projects={projects} />
          </div>

          {/* ── Stats overlay — TOP ── */}
          <div style={{ position:"absolute", top:14, left:14, right:14, zIndex:1000,
            display:"flex", alignItems:"stretch", gap:8, pointerEvents:"none" }}>

            {/* Title */}
            <div style={{ ...glass(`${GOLD}45`), display:"flex", alignItems:"center", gap:10,
              padding:"10px 16px", borderRadius:13, flexShrink:0, pointerEvents:"auto" }}>
              <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                background:tabColor, boxShadow:`0 0 10px ${tabGlow}` }} />
              <span style={{ fontSize:13, fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>
                {tabLabel} xaritasi
              </span>
            </div>

            {/* Stat cards */}
            {STATS.map(s => {
              const val = stats?.[s.key as keyof DashboardStats] ?? 0;
              const pct = s.key !== "totalProjects" && stats?.totalProjects
                ? Math.round((val / stats.totalProjects) * 100) : null;
              return (
                <div key={s.key} style={{ ...glass(`${s.color}40`),
                  display:"flex", flexDirection:"column", justifyContent:"center",
                  padding:"10px 15px", borderRadius:13, flexShrink:0, minWidth:96,
                  pointerEvents:"auto", position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
                    background:`linear-gradient(90deg, ${s.color}ee, ${s.color}33, transparent)` }} />
                  <p style={{ fontSize:9, fontWeight:800, color:`${s.color}cc`, margin:"0 0 5px",
                    textTransform:"uppercase", letterSpacing:"0.12em" }}>
                    {s.label}
                  </p>
                  <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
                    {loading
                      ? <div style={{ width:30, height:26, borderRadius:6,
                          background:"rgba(255,255,255,0.1)" }} className="animate-pulse" />
                      : <span style={{ fontSize:28, fontWeight:800, color:"#fff",
                          lineHeight:1, letterSpacing:"-0.04em" }}>{val}</span>
                    }
                    {pct !== null && !loading && (
                      <span style={{ fontSize:11, fontWeight:700, color:s.color }}>{pct}%</span>
                    )}
                    {s.link && !loading && (
                      <Link href={obyektLink}
                        style={{ fontSize:14, fontWeight:700, color:GOLD, textDecoration:"none" }}>→</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Legend — BOTTOM LEFT ── */}
          <div style={{ position:"absolute", bottom:14, left:14, zIndex:1000, pointerEvents:"none" }}>
            <div style={{ ...glass(`${GOLD}25`),
              display:"flex", flexDirection:"column", gap:7,
              padding:"12px 14px", borderRadius:13, pointerEvents:"auto" }}>
              {LEGEND.map(l => (
                <div key={l.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <div style={{ width:8, height:8, borderRadius:"50%", flexShrink:0,
                    background:l.color, boxShadow:`0 0 8px ${l.color}` }} />
                  <span style={{ fontSize:11, fontWeight:600, color:"rgba(255,255,255,0.75)",
                    whiteSpace:"nowrap" }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════ RIGHT PANEL ════ */}
        <div className="flex flex-col flex-shrink-0" style={{
          width:290,
          background:"rgba(6,12,28,0.94)",
          backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
          borderLeft:`1px solid ${GOLD}20`,
          boxShadow:"-8px 0 32px rgba(0,0,0,0.4)",
          overflow:"hidden",
        }}>
          {/* Gold top accent */}
          <div style={{ height:2, flexShrink:0,
            background:`linear-gradient(90deg, ${NAVY}, ${GOLD}cc 30%, ${GOLDL} 50%, ${GOLD}cc 70%, ${NAVY})` }} />

          {/* ── TAB SWITCHER ── */}
          <div style={{ padding:"14px 14px 10px", flexShrink:0,
            borderBottom:`1px solid rgba(201,168,76,0.12)` }}>
            <p style={{ fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:`${GOLD}80`,
              textTransform:"uppercase", margin:"0 0 10px" }}>
              Ko&apos;rinish turi
            </p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {([["INVESTITSIYA", iStats, "#60a5fa", "📊"], ["QURILISH", qStats, "#a78bfa", "🏗️"]] as const).map(
                ([t, s, c, emoji]) => {
                  const active = tab === t;
                  return (
                    <button key={t} onClick={() => setTab(t)} style={{
                      padding:"12px 10px", borderRadius:12, textAlign:"left", cursor:"pointer",
                      transition:"all .18s",
                      background: active ? `${c}16` : "rgba(255,255,255,0.04)",
                      border:`1.5px solid ${active ? c+"50" : "rgba(255,255,255,0.08)"}`,
                      boxShadow: active ? `0 0 16px ${c}20` : "none",
                    }}>
                      <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5 }}>
                        <span style={{ fontSize:14 }}>{emoji}</span>
                        <p style={{ fontSize:9, fontWeight:800, color:c, margin:0,
                          textTransform:"uppercase", letterSpacing:"0.1em" }}>
                          {t === "INVESTITSIYA" ? "Investitsiya" : "Qurilish"}
                        </p>
                      </div>
                      <p style={{ fontSize:26, fontWeight:800, color:CREAM, margin:"0 0 2px",
                        letterSpacing:"-0.03em", lineHeight:1 }}>
                        {loading ? "—" : (s?.totalProjects ?? 0)}
                      </p>
                      <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", margin:0 }}>loyiha</p>
                    </button>
                  );
                }
              )}
            </div>
          </div>

          {/* ── PROBLEMS HEADER ── */}
          <div style={{ padding:"12px 14px 8px", flexShrink:0,
            borderBottom:`1px solid rgba(255,255,255,0.06)` }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div>
                <p style={{ fontSize:14, fontWeight:700, color:CREAM, margin:"0 0 2px" }}>
                  So&apos;nggi muammolar
                </p>
                <p style={{ fontSize:10, color:"rgba(255,255,255,0.3)", margin:0 }}>
                  {loading ? "yuklanmoqda..." : `${problems.length} ta yozuv`}
                </p>
              </div>
              <Link href="/investitsiya/muammolar" style={{
                display:"flex", alignItems:"center", gap:5,
                fontSize:11, fontWeight:700, padding:"6px 12px", borderRadius:9,
                background:`${GOLD}18`, color:GOLD, border:`1px solid ${GOLD}40`,
                textDecoration:"none",
              }}>
                Barchasi
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Gold dot divider */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:5,
            padding:"6px 0", flexShrink:0 }}>
            <div style={{ flex:1, height:1, marginLeft:14,
              background:`linear-gradient(90deg, transparent, ${GOLD}28)` }} />
            <div style={{ width:4, height:4, borderRadius:"50%", background:`${GOLD}50` }} />
            <div style={{ width:5, height:5, borderRadius:"50%", background:GOLD }} />
            <div style={{ width:4, height:4, borderRadius:"50%", background:`${GOLD}50` }} />
            <div style={{ flex:1, height:1, marginRight:14,
              background:`linear-gradient(270deg, transparent, ${GOLD}28)` }} />
          </div>

          {/* ── PROBLEM LIST ── */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:"none", padding:"0 10px 10px" }}>
            <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
              {loading ? (
                [...Array(6)].map((_,i) => (
                  <div key={i} className="animate-pulse" style={{ height:62, borderRadius:12,
                    background:"rgba(255,255,255,0.05)" }} />
                ))
              ) : problems.length === 0 ? (
                <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
                  justifyContent:"center", padding:"40px 0", gap:10 }}>
                  <div style={{ width:48, height:48, borderRadius:16,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.08)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="rgba(255,255,255,0.2)" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10"/><path d="m9 9 6 6m0-6-6 6"/>
                    </svg>
                  </div>
                  <p style={{ fontSize:12, color:"rgba(255,255,255,0.25)", fontWeight:600 }}>
                    Muammolar yo&apos;q
                  </p>
                </div>
              ) : problems.map(pr => {
                const ps = PROB_STYLE[pr.type] ?? { icon:"⚠️", color:"#94a3b8", bg:"rgba(148,163,184,0.1)" };
                return (
                  <Link key={pr.id} href="/investitsiya/muammolar" style={{
                    display:"flex", alignItems:"flex-start", gap:10,
                    padding:"10px 10px", borderRadius:12, textDecoration:"none",
                    background:"rgba(255,255,255,0.04)",
                    border:"1px solid rgba(255,255,255,0.07)",
                    transition:"all .15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.borderColor = `${GOLD}30`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  }}>
                    <div style={{ width:34, height:34, borderRadius:10, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:15, background:ps.bg, border:`1px solid ${ps.color}30` }}>
                      {ps.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{ fontSize:12, fontWeight:600, color:CREAM, margin:"0 0 3px",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {pr.title}
                      </p>
                      <p style={{ fontSize:10, color:"rgba(255,255,255,0.38)", margin:"0 0 2px",
                        whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                        {pr.projectName ?? pr.project?.name ?? pr.responsibleDepartment ?? "—"}
                      </p>
                      <p style={{ fontSize:10, color:`${GOLD}90`, margin:0 }}>
                        {timeAgo(pr.createdAt)}
                      </p>
                    </div>
                    <div style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, marginTop:4,
                      background:ps.color, boxShadow:`0 0 8px ${ps.color}80` }} />
                  </Link>
                );
              })}
            </div>
          </div>
<div style={{ padding:"12px 14px 16px", borderTop:`1px solid ${GOLD}20`, marginTop:"8px" }}>
  <AiTahlilBlock />
</div>
          {/* Bottom gold line */}
          <div style={{ height:2, flexShrink:0,
            background:`linear-gradient(90deg, ${NAVY}, ${GOLD}70 40%, ${GOLD}90 50%, ${GOLD}70 60%, ${NAVY})` }} />
        </div>
      </div>
    </div>
  );
}
