"use client";
import { useState, useEffect, useMemo } from "react";
import { getAllUpdates } from "@/services/projectUpdateService";
import type { ProjectUpdate } from "@/types/api.types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const STATUS_CFG: Record<string, { label: string; color: string; emoji: string }> = {
  REJALASHTIRILGAN: { label: "Rejalashtirilgan", color: "#60a5fa", emoji: "🗓️" },
  JARAYONDA:        { label: "Jarayonda",         color: "#f59e0b", emoji: "⚡" },
  KECHIKKAN:        { label: "Kechikkan",         color: "#f97316", emoji: "⏰" },
  MUAMMOLI:         { label: "Muammoli",          color: "#ef4444", emoji: "⚠️" },
  TUGALLANGAN:      { label: "Tugallangan",       color: "#10b981", emoji: "✅" },
};
const scfg = (s: string) => STATUS_CFG[s] ?? { label: s, color: "#64748b", emoji: "📋" };

export default function YangiliklarPage() {
  const [updates,  setUpdates]  = useState<ProjectUpdate[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("barchasi");
  const [search,   setSearch]   = useState("");
  const [modalImg, setModalImg] = useState<string | null>(null);

  useEffect(() => {
    getAllUpdates()
      .then(setUpdates)
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  const TABS = [
    { key:"barchasi",         label:"Barchasi" },
    { key:"JARAYONDA",        label:"Jarayonda" },
    { key:"KECHIKKAN",        label:"Kechikkan" },
    { key:"MUAMMOLI",         label:"Muammoli" },
    { key:"TUGALLANGAN",      label:"Tugallangan" },
  ];

  const counts: Record<string, number> = { barchasi: updates.length };
  updates.forEach(u => { counts[u.status] = (counts[u.status] || 0) + 1; });

  const filtered = useMemo(() => updates.filter(u => {
    const matchTab = tab === "barchasi" || u.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      u.title.toLowerCase().includes(q) ||
      (u.description       ?? "").toLowerCase().includes(q) ||
      (u.projectName       ?? "").toLowerCase().includes(q) ||
      (u.createdByFullName ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  }), [updates, tab, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
          Loyiha yangiliklari
        </h1>
        <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
          Tadbirkorlar yuborgan loyiha jarayon ma&apos;lumotlari
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label:"Jami",            val: updates.length,                       color:"#60a5fa" },
          { label:"Jarayonda",       val: counts["JARAYONDA"]        || 0,      color:"#f59e0b" },
          { label:"Kechikkan",       val: counts["KECHIKKAN"]        || 0,      color:"#f97316" },
          { label:"Muammoli",        val: counts["MUAMMOLI"]         || 0,      color:"#ef4444" },
          { label:"Tugallangan",     val: counts["TUGALLANGAN"]      || 0,      color:"#10b981" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-2xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xl font-bold" style={{ color: s.color }}>{loading ? "..." : s.val}</p>
            <p className="text-[10px] mt-0.5" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:"rgba(100,130,200,0.4)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Loyiha, sarlavha, yuboruvchi..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.35)"; }}
            onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
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

      {/* Table header */}
      <div className="hidden md:grid grid-cols-[1.5fr_2fr_1.2fr_1fr_1fr_80px] gap-3 px-4 text-[11px] font-semibold uppercase tracking-wide"
        style={{ color:"rgba(100,130,200,0.4)" }}>
        <span>Loyiha</span><span>Sarlavha</span><span>Yuboruvchi</span><span>Holat</span><span>Sana</span><span>Rasm</span>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3 animate-pulse">📋</div>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>Yuklanmoqda...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Yangiliklar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Bu toifada ma'lumotlar yo'q"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((u, i) => {
            const sc = scfg(u.status);
            return (
              <div key={u.id}
                className="flex flex-col md:grid md:grid-cols-[1.5fr_2fr_1.2fr_1fr_1fr_80px] gap-3 items-center p-4 rounded-2xl transition-all"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", animationDelay:`${i*30}ms` }}
                onMouseEnter={(e:any) => e.currentTarget.style.background="rgba(255,255,255,0.055)"}
                onMouseLeave={(e:any) => e.currentTarget.style.background="rgba(255,255,255,0.03)"}>

                {/* Loyiha */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.25)" }}>
                    🏗️
                  </div>
                  <p className="text-xs font-semibold line-clamp-1" style={{ color:"rgba(160,190,240,0.85)" }}>
                    {u.projectName ?? `#${u.projectId}`}
                  </p>
                </div>

                {/* Sarlavha */}
                <div className="w-full md:w-auto">
                  <p className="text-sm font-semibold line-clamp-1" style={{ color:"rgba(200,220,255,0.9)" }}>{u.title}</p>
                  {u.description && (
                    <p className="text-xs line-clamp-1 mt-0.5" style={{ color:"rgba(120,150,200,0.55)" }}>{u.description}</p>
                  )}
                </div>

                {/* Yuboruvchi */}
                <p className="text-xs w-full md:w-auto" style={{ color:"rgba(100,130,200,0.55)" }}>
                  👤 {u.createdByFullName ?? "—"}
                </p>

                {/* Holat */}
                <div className="w-full md:w-auto">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}30` }}>
                    {sc.emoji} {sc.label}
                  </span>
                </div>

                {/* Sana */}
                <p className="text-xs w-full md:w-auto" style={{ color:"rgba(100,130,200,0.5)" }}>
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString("uz-UZ") : "—"}
                </p>

                {/* Rasm */}
                <div className="w-full md:w-auto">
                  {u.imageUrl ? (
                    <button onClick={() => setModalImg(`${API_BASE}${u.imageUrl}`)}
                      className="block relative overflow-hidden rounded-xl transition-all"
                      style={{ border:"1px solid rgba(255,255,255,0.1)", maxWidth:80, minHeight:56 }}
                      onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(96,165,250,0.5)"}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.1)"}>
                      <img src={`${API_BASE}${u.imageUrl}`} alt="rasm"
                        className="w-full object-cover"
                        style={{ height:56, display:"block" }} />
                      <div className="absolute inset-0 flex items-center justify-center"
                        style={{ background:"rgba(0,0,0,0)", transition:"background 0.2s" }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background="rgba(0,0,0,0.45)"}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background="rgba(0,0,0,0)"}>
                      </div>
                    </button>
                  ) : (
                    <span className="text-xs" style={{ color:"rgba(100,130,200,0.35)" }}>—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-center" style={{ color:"rgba(100,130,200,0.35)" }}>
        Jami {filtered.length} ta yangilik ko&apos;rsatilmoqda
      </p>

      {/* Image Modal */}
      {modalImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:"rgba(0,0,0,0.85)" }}
          onClick={() => setModalImg(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setModalImg(null)}
              className="absolute -top-10 right-0 text-white text-sm font-bold px-3 py-1 rounded-lg"
              style={{ background:"rgba(255,255,255,0.15)" }}>
              ✕ Yopish
            </button>
            <img src={modalImg} alt="yangilik rasmi"
              className="w-full rounded-2xl object-contain"
              style={{ maxHeight:"80vh", border:"1px solid rgba(255,255,255,0.15)" }} />
            <a href={modalImg} download
              className="block mt-3 text-center text-sm font-bold py-2 rounded-xl"
              style={{ background:"rgba(59,130,246,0.2)", color:"#60a5fa", border:"1px solid rgba(59,130,246,0.3)" }}>
              ⬇️ Yuklab olish
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
