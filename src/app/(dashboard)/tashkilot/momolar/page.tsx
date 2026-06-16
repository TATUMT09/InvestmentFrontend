"use client";
import { useState, useEffect, useMemo } from "react";
import { getProblems, updateProblem } from "@/services/problemService";
import type { Problem } from "@/types/api.types";

const STATUS_CFG: Record<string, { label: string; color: string }> = {
  YANGI:      { label: "Yangi",      color: "#64748b" },
  JARAYONDA:  { label: "Jarayonda",  color: "#f59e0b" },
  HAL_ETILDI: { label: "Hal etildi", color: "#10b981" },
};
const cfg = (s: string) => STATUS_CFG[s] ?? { label: s, color: "#64748b" };

const TYPE_ICONS:  Record<string, string> = { ELEKTR:"⚡", SUV:"💧", GAZ:"🔥", YOL:"🛣️", HUJJAT:"📄", MOLIYA:"💰", INTERNET:"🌐", BOSHQA:"📋" };
const TYPE_COLORS: Record<string, string> = { ELEKTR:"#fbbf24", SUV:"#38bdf8", GAZ:"#f87171", YOL:"#a78bfa", HUJJAT:"#94a3b8", MOLIYA:"#34d399", INTERNET:"#60a5fa", BOSHQA:"#94a3b8" };

const TABS = [
  { key:"barchasi",   label:"Barchasi" },
  { key:"YANGI",      label:"Yangi" },
  { key:"JARAYONDA",  label:"Jarayonda" },
  { key:"HAL_ETILDI", label:"Hal etildi" },
];

export default function TashkilotMomolarPage() {
  const [tab,      setTab]      = useState("barchasi");
  const [search,   setSearch]   = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [izohMap,  setIzohMap]  = useState<Record<number, string>>({});
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    getProblems()
      .then(setProblems)
      .catch(() => setProblems([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => problems.filter(p => {
    const matchTab    = tab === "barchasi" || p.status === tab;
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      p.title.toLowerCase().includes(q) ||
      (p.description       ?? "").toLowerCase().includes(q) ||
      (p.projectName       ?? "").toLowerCase().includes(q) ||
      (p.createdByFullName ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  }), [problems, tab, search]);

  const counts: Record<string, number> = { barchasi: problems.length };
  problems.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });

  const advance = async (p: Problem) => {
    const next = p.status === "YANGI" ? "JARAYONDA" : p.status === "JARAYONDA" ? "HAL_ETILDI" : null;
    if (!next) return;
    setUpdating(p.id);
    try {
      await updateProblem(p.id, { status: next });
      setProblems(prev => prev.map(x => x.id === p.id ? { ...x, status: next } : x));
      setIzohMap(prev => { const n = {...prev}; delete n[p.id]; return n; });
    } catch { /* ignore */ }
    finally { setUpdating(null); }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
          Kelgan momolar
        </h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Sizga yo&apos;naltirilgan momolarni kuzating va boshqaring
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label:"Jami",      val: problems.length,             color:"#60a5fa" },
          { label:"Yangi",     val: counts["YANGI"]     || 0,    color:"#64748b" },
          { label:"Jarayonda", val: counts["JARAYONDA"] || 0,    color:"#f59e0b" },
          { label:"Hal etildi",val: counts["HAL_ETILDI"]|| 0,    color:"#10b981" },
        ].map(s => (
          <div key={s.label} className="p-4 rounded-2xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-2xl font-bold" style={{ color: s.color }}>{loading ? "..." : s.val}</p>
            <p className="text-xs mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:"rgba(100,130,200,0.4)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Muammo nomi yoki loyiha..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e=>{e.target.style.borderColor="rgba(59,130,246,0.35)";e.target.style.boxShadow="0 0 0 3px rgba(59,130,246,0.08)";}}
            onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";e.target.style.boxShadow="none";}}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={()=>setTab(t.key)}
              className="text-xs px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5"
              style={{
                background: tab===t.key ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${tab===t.key ? "rgba(59,130,246,0.38)" : "rgba(255,255,255,0.07)"}`,
                color: tab===t.key ? "#60a5fa" : "rgba(130,160,210,0.65)",
              }}>
              {t.label}
              {(counts[t.key]||0) > 0 && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold"
                  style={{ background:"rgba(255,255,255,0.08)", color:"inherit" }}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3 animate-pulse">🔧</div>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3">🔧</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Momolar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Bu toifada momolar yo'q"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => {
            const sc       = cfg(p.status);
            const icon     = TYPE_ICONS[p.type]  ?? "📋";
            const tcolor   = TYPE_COLORS[p.type] ?? "#94a3b8";
            const isDone   = p.status === "HAL_ETILDI";
            const nextLabel = p.status === "YANGI" ? "Jarayonda deb belgilash" : p.status === "JARAYONDA" ? "Hal etildi deb belgilash" : null;
            return (
              <div key={p.id} className="rounded-2xl overflow-hidden"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>

                {/* Card header */}
                <div className="flex items-start gap-4 p-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background:`${tcolor}18`, border:`1.5px solid ${tcolor}35` }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1.5" style={{ color:"rgba(200,220,255,0.9)" }}>{p.title}</p>
                    {p.description && (
                      <p className="text-xs mb-1.5 line-clamp-2" style={{ color:"rgba(140,170,220,0.55)" }}>{p.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color:"rgba(100,130,200,0.55)" }}>
                      {p.projectName       && <span>🏗️ {p.projectName}</span>}
                      {p.createdByFullName  && <span>👤 {p.createdByFullName}</span>}
                      {p.createdAt         && <span>🕐 {new Date(p.createdAt).toLocaleDateString("uz-UZ")}</span>}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}30` }}>
                    {sc.label}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mx-4 h-1 rounded-full overflow-hidden mb-3"
                  style={{ background:"rgba(255,255,255,0.05)" }}>
                  <div className="h-full rounded-full transition-all"
                    style={{
                      background: sc.color,
                      width: p.status==="YANGI" ? "25%" : p.status==="JARAYONDA" ? "65%" : "100%",
                      boxShadow:`0 0 8px ${sc.color}60`,
                    }} />
                </div>

                {/* Action area */}
                {isDone ? (
                  <div className="px-4 pb-3 flex items-center gap-2">
                    <span className="text-xs font-semibold" style={{ color:"#34d399" }}>✓ Muvaffaqiyatli yakunlangan</span>
                  </div>
                ) : (
                  <div className="px-4 pb-4 pt-1 border-t"
                    style={{ borderColor:"rgba(255,255,255,0.06)", background:"rgba(255,255,255,0.01)" }}>
                    <div className="flex gap-3 items-end mt-3">
                      <textarea
                        value={izohMap[p.id] || ""}
                        onChange={e => setIzohMap(prev => ({ ...prev, [p.id]: e.target.value }))}
                        placeholder="Izoh qoldiring (ixtiyoriy)..."
                        rows={1}
                        className="flex-1 text-sm px-3 py-2 rounded-xl outline-none resize-none"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
                        onFocus={e=>{e.target.style.borderColor="rgba(16,185,129,0.3)";}}
                        onBlur={e=>{e.target.style.borderColor="rgba(255,255,255,0.08)";}}
                      />
                      <button
                        disabled={updating === p.id}
                        onClick={() => advance(p)}
                        className="text-sm font-bold px-4 py-2 rounded-xl transition-all flex-shrink-0"
                        style={{
                          background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#34d399",
                          opacity: updating === p.id ? 0.6 : 1,
                          cursor:  updating === p.id ? "not-allowed" : "pointer",
                        }}
                        onMouseEnter={e=>{ if (updating !== p.id) (e.currentTarget as HTMLButtonElement).style.background="rgba(16,185,129,0.25)"; }}
                        onMouseLeave={e=>{ (e.currentTarget as HTMLButtonElement).style.background="rgba(16,185,129,0.15)"; }}>
                        {updating === p.id ? "..." : `✓ ${nextLabel}`}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
