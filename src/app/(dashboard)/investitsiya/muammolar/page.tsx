"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getProblems, updateProblem } from "@/services/problemService";
import { useUiStore } from "@/store/uiStore";
import type { Problem } from "@/types/api.types";

const GOLD = "#c9a84c";

const STATUS_CFG: Record<string,{label:string;color:string;bg:string;border:string}> = {
  YANGI:      {label:"Yangi",     color:"#38bdf8", bg:"rgba(56,189,248,0.12)",  border:"#38bdf8"},
  JARAYONDA:  {label:"Jarayonda", color:"#60a5fa", bg:"rgba(96,165,250,0.12)",  border:"#60a5fa"},
  HAL_ETILDI: {label:"Hal etildi",color:"#34d399", bg:"rgba(52,211,153,0.12)", border:"#34d399"},
};
const fallback=(s:string)=>STATUS_CFG[s]??{label:s,color:"#94a3b8",bg:"rgba(148,163,184,0.12)",border:"#94a3b8"};

const TYPE_ICONS: Record<string,string> = {ELEKTR:"⚡",SUV:"💧",GAZ:"🔥",YOL:"🛣️",HUJJAT:"📄"};
const TYPE_COLORS:Record<string,string> = {ELEKTR:"#fbbf24",SUV:"#38bdf8",GAZ:"#f87171",YOL:"#a78bfa",HUJJAT:"#94a3b8"};

const STATUS_OPTIONS = ["Barcha holatlar","YANGI","JARAYONDA","HAL_ETILDI"];
const TYPE_OPTIONS   = ["Barcha turlar","ELEKTR","SUV","GAZ","YOL","HUJJAT"];

export default function MuammolarPage() {
  const { lightMode } = useUiStore();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [status,   setStatus]   = useState("Barcha holatlar");
  const [tur,      setTur]      = useState("Barcha turlar");
  const [updating, setUpdating] = useState<number|null>(null);

  // Theme
  const pageBg    = lightMode ? "#f0f4ff"              : "#081526";
  const headerBg  = lightMode ? "rgba(255,255,255,0.97)": "rgba(6,12,28,0.7)";
  const cardBg    = lightMode ? "#ffffff"              : "rgba(6,12,28,0.92)";
  const filterBg  = lightMode ? "#f8faff"              : "transparent";
  const textPri   = lightMode ? "#0f172a"              : "#faf7f0";
  const textSec   = lightMode ? "rgba(0,0,0,0.45)"     : "rgba(255,255,255,0.4)";
  const borderC   = lightMode ? "rgba(201,168,76,0.25)": "rgba(201,168,76,0.14)";
  const rowBorder = lightMode ? "rgba(0,0,0,0.06)"     : "rgba(255,255,255,0.05)";
  const rowHover  = lightMode ? "#f0f4ff"              : "rgba(255,255,255,0.06)";
  const inputBg   = lightMode ? "#ffffff"              : "rgba(255,255,255,0.06)";
  const inputBd   = lightMode ? "#e2e8f0"              : "rgba(255,255,255,0.1)";
  const thColor   = lightMode ? `rgba(120,80,0,0.55)`  : `${GOLD}80`;
  const thBg      = lightMode ? "rgba(0,0,0,0.04)"     : "rgba(255,255,255,0.04)";

  useEffect(() => {
    setLoading(true);
    getProblems().then(setProblems).catch(()=>setProblems([])).finally(()=>setLoading(false));
  }, []);

  const filtered = useMemo(() => problems.filter(p => {
    const s = status === "Barcha holatlar" || p.status === status;
    const t = tur    === "Barcha turlar"   || p.type   === tur;
    const q = !search || p.title.toLowerCase().includes(search.toLowerCase()) ||
              (p.project?.name ?? "").toLowerCase().includes(search.toLowerCase());
    return s && t && q;
  }), [problems, status, tur, search]);

  const handleStatusChange = async (p: Problem, newStatus: string) => {
    setUpdating(p.id);
    try {
      await updateProblem(p.id, { status: newStatus });
      setProblems(prev => prev.map(x => x.id === p.id ? {...x, status: newStatus} : x));
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  };

  return (
    <div className="-m-6 flex flex-col" style={{
      height:"calc(100vh - 60px)", background:pageBg,
      overflow:"hidden", position:"relative", transition:"background 0.3s"
    }}>

      {/* Texture — only dark mode */}
      {!lightMode && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0,
          backgroundImage:"radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize:"30px 30px" }} />
      )}

      {/* Glow — only dark mode */}
      {!lightMode && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0,
          background:`radial-gradient(ellipse 55% 35% at 75% 0%, ${GOLD}0d, transparent),
                      radial-gradient(ellipse 35% 45% at 0% 100%, #0d1f3cbb, transparent)` }} />
      )}

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{ zIndex:10, height:2,
        background:`linear-gradient(90deg, transparent, ${GOLD}cc 30%, ${GOLD}dd 50%, ${GOLD}cc 70%, transparent)` }} />

      {/* ══ HEADER ══ */}
      <div className="relative flex-shrink-0 px-6 py-4" style={{ zIndex:5,
        borderBottom:`1px solid ${borderC}`,
        background:headerBg, backdropFilter:"blur(10px)" }}>

        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block text-[9px] font-bold tracking-[0.2em] uppercase px-2.5 py-1 rounded-lg mb-2"
              style={{ background:`${GOLD}18`, border:`1px solid ${GOLD}40`, color:GOLD }}>
              MUAMMOLAR
            </span>
            <h1 className="text-xl font-bold" style={{ color:textPri }}>Muammolar ro&apos;yxati</h1>
            <p className="text-[11px] mt-0.5" style={{ color:textSec }}>
              Barcha loyihalar bo&apos;yicha muammolar
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl"
            style={{ background:"rgba(248,113,113,0.12)", border:"1px solid rgba(248,113,113,0.3)", color:"#f87171" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {loading ? "..." : filtered.length} ta muammo
          </div>
        </div>
      </div>

      {/* ══ FILTERS ══ */}
      <div className="relative flex-shrink-0 px-6 py-3 flex items-center gap-3" style={{ zIndex:1,
        borderBottom:`1px solid ${rowBorder}`, background:filterBg }}>

        <select value={status} onChange={e=>setStatus(e.target.value)}
          style={{ padding:"7px 11px", borderRadius:10, fontSize:12, fontWeight:600,
            background:inputBg, border:`1px solid ${inputBd}`, color:textPri,
            cursor:"pointer", outline:"none" }}>
          {STATUS_OPTIONS.map(v=><option key={v} value={v} style={{ background: lightMode ? "#fff" : "#0d1f3c", color:textPri }}>
            {v==="Barcha holatlar"?v:fallback(v).label}
          </option>)}
        </select>

        <select value={tur} onChange={e=>setTur(e.target.value)}
          style={{ padding:"7px 11px", borderRadius:10, fontSize:12, fontWeight:600,
            background:inputBg, border:`1px solid ${inputBd}`, color:textPri,
            cursor:"pointer", outline:"none" }}>
          {TYPE_OPTIONS.map(v=><option key={v} value={v} style={{ background: lightMode ? "#fff" : "#0d1f3c", color:textPri }}>
            {v}
          </option>)}
        </select>

        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={textSec} strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Qidirish..."
            style={{ width:"100%", padding:"7px 11px 7px 32px", borderRadius:10, fontSize:12,
              background:inputBg, border:`1px solid ${inputBd}`, color:textPri,
              outline:"none", transition:"all .15s" }}
            onFocus={e => { e.currentTarget.style.borderColor = `${GOLD}60`; }}
            onBlur={e  => { e.currentTarget.style.borderColor = inputBd; }} />
        </div>

        <span className="ml-auto text-xs font-semibold" style={{ color:textSec }}>
          {filtered.length} natija
        </span>
      </div>

      {/* ══ TABLE ══ */}
      <div className="relative flex-1 overflow-y-auto" style={{ zIndex:1 }}>
        <div style={{ padding:"16px 24px" }}>
          <div className="rounded-2xl overflow-hidden" style={{
            background:cardBg, backdropFilter:"blur(16px)",
            border:`1px solid ${borderC}`,
            boxShadow: lightMode ? "0 4px 20px rgba(0,0,0,0.08)" : "0 8px 32px rgba(0,0,0,0.4)" }}>

            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background:thBg, borderBottom:`1px solid ${borderC}` }}>
                  {["#","MUAMMO","OBYEKT","TURI","HOLAT","MAS'UL BO'LIM","AMAL"].map(h=>(
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-bold tracking-widest"
                      style={{ color:thColor }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [...Array(6)].map((_,i)=>(
                    <tr key={i} style={{ borderBottom:`1px solid ${rowBorder}` }}>
                      {[...Array(7)].map((_,j)=>(
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 rounded animate-pulse"
                            style={{ background: lightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)", width:j===1?"160px":"80px" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                        style={{ background: lightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={textSec} strokeWidth="1.5">
                          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                        </svg>
                      </div>
                      <p className="text-sm font-medium" style={{ color:textSec }}>
                        Ma&apos;lumot topilmadi
                      </p>
                    </div>
                  </td></tr>
                ) : filtered.map((p,i) => {
                  const h = fallback(p.status);
                  const icon  = TYPE_ICONS[p.type]  ?? "⚠️";
                  const tcolor= TYPE_COLORS[p.type] ?? "#94a3b8";
                  return (
                    <tr key={p.id} className="transition-all"
                      style={{ borderBottom:`1px solid ${rowBorder}` }}
                      onMouseEnter={e=>(e.currentTarget.style.background=rowHover)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
                      <td className="px-4 py-3.5 text-xs font-mono" style={{ color:textSec }}>
                        {String(i+1).padStart(2,"0")}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                            style={{ background:`${tcolor}18`, border:`1px solid ${tcolor}35` }}>
                            {icon}
                          </div>
                          <span className="text-sm font-semibold" style={{ color:textPri }}>{p.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium" style={{ color:textSec }}>
                        {p.projectName ?? p.project?.name ?? `#${p.projectId}`}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
                          style={{ background:`${tcolor}18`, color:tcolor, border:`1px solid ${tcolor}35` }}>
                          {p.type}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold"
                          style={{ background:h.bg, color:h.color, border:`1px solid ${h.border}60` }}>
                          {h.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs font-medium" style={{ color:textSec }}>
                        {p.department ?? p.responsibleDepartment ?? "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {p.status !== "HAL_ETILDI" && (
                            <button disabled={updating === p.id}
                              onClick={() => handleStatusChange(p, p.status === "YANGI" ? "JARAYONDA" : "HAL_ETILDI")}
                              className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                              style={{
                                background: p.status==="YANGI" ? "rgba(96,165,250,0.18)" : "rgba(52,211,153,0.18)",
                                color:      p.status==="YANGI" ? "#60a5fa" : "#34d399",
                                border:     p.status==="YANGI" ? "1px solid rgba(96,165,250,0.4)" : "1px solid rgba(52,211,153,0.4)",
                                cursor: updating === p.id ? "not-allowed" : "pointer",
                                opacity: updating === p.id ? 0.6 : 1,
                              }}>
                              {updating===p.id ? "..." : p.status==="YANGI" ? "Boshlash" : "Hal etish"}
                            </button>
                          )}
                          <Link href={`/investitsiya/muammolar/${p.id}`}
                            className="px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                            style={{ background:`${GOLD}12`, color:GOLD, border:`1px solid ${GOLD}35` }}
                            onMouseEnter={e=>(e.currentTarget.style.background=`${GOLD}22`)}
                            onMouseLeave={e=>(e.currentTarget.style.background=`${GOLD}12`)}>
                            Batafsil →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
