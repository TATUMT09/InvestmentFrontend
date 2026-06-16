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

interface ProjectGroup {
  projectId: number;
  projectName: string;
  updates: ProjectUpdate[];
  lastUpdate: ProjectUpdate;
}

export default function YangiliklarPage() {
  const [updates,    setUpdates]    = useState<ProjectUpdate[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [tab,        setTab]        = useState("barchasi");
  const [openId,     setOpenId]     = useState<number | null>(null);
  const [modalImg,   setModalImg]   = useState<string | null>(null);

  useEffect(() => {
    getAllUpdates()
      .then(setUpdates)
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  const TABS = [
    { key:"barchasi",    label:"Barchasi" },
    { key:"JARAYONDA",   label:"Jarayonda" },
    { key:"KECHIKKAN",   label:"Kechikkan" },
    { key:"MUAMMOLI",    label:"Muammoli" },
    { key:"TUGALLANGAN", label:"Tugallangan" },
  ];

  const counts: Record<string, number> = { barchasi: updates.length };
  updates.forEach(u => { counts[u.status] = (counts[u.status] || 0) + 1; });

  const groups = useMemo<ProjectGroup[]>(() => {
    const map = new Map<number, ProjectGroup>();
    updates.forEach(u => {
      const existing = map.get(u.projectId);
      if (!existing) {
        map.set(u.projectId, { projectId: u.projectId, projectName: u.projectName ?? `#${u.projectId}`, updates: [u], lastUpdate: u });
      } else {
        existing.updates.push(u);
        if (new Date(u.createdAt) > new Date(existing.lastUpdate.createdAt)) {
          existing.lastUpdate = u;
        }
      }
    });
    return Array.from(map.values());
  }, [updates]);

  const filteredGroups = useMemo(() => {
    return groups.filter(g => {
      const q = search.toLowerCase();
      const matchSearch = !q || g.projectName.toLowerCase().includes(q) ||
        g.updates.some(u => u.title.toLowerCase().includes(q) || (u.description ?? "").toLowerCase().includes(q));
      const matchTab = tab === "barchasi" || g.updates.some(u => u.status === tab);
      return matchSearch && matchTab;
    }).map(g => ({
      ...g,
      updates: tab === "barchasi" ? g.updates : g.updates.filter(u => u.status === tab),
    }));
  }, [groups, tab, search]);

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
          { label:"Jami",        val: updates.length,               color:"#60a5fa" },
          { label:"Jarayonda",   val: counts["JARAYONDA"]   || 0,   color:"#f59e0b" },
          { label:"Kechikkan",   val: counts["KECHIKKAN"]   || 0,   color:"#f97316" },
          { label:"Muammoli",    val: counts["MUAMMOLI"]    || 0,   color:"#ef4444" },
          { label:"Tugallangan", val: counts["TUGALLANGAN"] || 0,   color:"#10b981" },
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
            placeholder="Loyiha yoki sarlavha..."
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

      {/* Groups */}
      {loading ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3 animate-pulse">📋</div>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>Yuklanmoqda...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="py-16 text-center rounded-2xl"
          style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div className="text-4xl mb-3">📋</div>
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Yangiliklar topilmadi</p>
          <p className="text-sm" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Bu toifada ma'lumotlar yo'q"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredGroups.map(g => {
            const isOpen = openId === g.projectId;
            const sc = scfg(g.lastUpdate.status);
            const jarayondaCount = g.updates.filter(u => u.status === "JARAYONDA").length;
            const muammolCount   = g.updates.filter(u => u.status === "MUAMMOLI").length;
            const tugallanCount  = g.updates.filter(u => u.status === "TUGALLANGAN").length;

            return (
              <div key={g.projectId} className="rounded-2xl overflow-hidden"
                style={{ border:`1px solid ${isOpen ? "rgba(59,130,246,0.25)" : "rgba(255,255,255,0.07)"}`, transition:"border-color 0.2s" }}>

                {/* Project row — header */}
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left transition-all"
                  style={{ background: isOpen ? "rgba(59,130,246,0.08)" : "rgba(255,255,255,0.03)" }}
                  onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background="rgba(255,255,255,0.055)"; }}
                  onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
                  onClick={() => setOpenId(isOpen ? null : g.projectId)}>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.25)" }}>
                    🏗️
                  </div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color:"rgba(200,220,255,0.95)" }}>
                      {g.projectName}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color:"rgba(100,130,200,0.5)" }}>
                      {g.updates.length} ta yangilik
                    </p>
                  </div>

                  {/* Mini stats */}
                  <div className="hidden sm:flex items-center gap-2">
                    {jarayondaCount > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background:"rgba(245,158,11,0.15)", color:"#f59e0b" }}>
                        ⚡ {jarayondaCount}
                      </span>
                    )}
                    {muammolCount > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background:"rgba(239,68,68,0.15)", color:"#ef4444" }}>
                        ⚠️ {muammolCount}
                      </span>
                    )}
                    {tugallanCount > 0 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background:"rgba(16,185,129,0.15)", color:"#10b981" }}>
                        ✅ {tugallanCount}
                      </span>
                    )}
                  </div>

                  {/* Last status */}
                  <span className="hidden md:block text-[11px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}30` }}>
                    {sc.emoji} {sc.label}
                  </span>

                  {/* Chevron */}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    style={{ color:"rgba(100,130,200,0.5)", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s", flexShrink:0 }}>
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>

                {/* Updates list — expanded */}
                {isOpen && (
                  <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)" }}>
                    {/* sub-header */}
                    <div className="hidden md:grid px-5 py-2 text-[10px] font-bold uppercase tracking-widest"
                      style={{ gridTemplateColumns:"2fr 1.2fr 1fr 1fr 80px", color:"rgba(100,130,200,0.4)", background:"rgba(255,255,255,0.02)" }}>
                      <span>Sarlavha</span>
                      <span>Yuboruvchi</span>
                      <span>Holat</span>
                      <span>Sana</span>
                      <span>Rasm</span>
                    </div>

                    {g.updates.map((u, i) => {
                      const usc = scfg(u.status);
                      return (
                        <div key={u.id}
                          className="md:grid px-5 py-3.5 flex flex-col gap-2 transition-all"
                          style={{
                            gridTemplateColumns:"2fr 1.2fr 1fr 1fr 80px",
                            alignItems:"center",
                            gap:"12px",
                            background: i%2===0 ? "rgba(255,255,255,0.015)" : "transparent",
                            borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                          }}>

                          {/* Sarlavha */}
                          <div>
                            <p className="text-sm font-semibold" style={{ color:"rgba(200,220,255,0.9)" }}>{u.title}</p>
                            {u.description && (
                              <p className="text-xs mt-0.5 line-clamp-1" style={{ color:"rgba(120,150,200,0.55)" }}>{u.description}</p>
                            )}
                          </div>

                          {/* Yuboruvchi */}
                          <p className="text-xs" style={{ color:"rgba(100,130,200,0.6)" }}>
                            👤 {u.createdByFullName ?? "—"}
                          </p>

                          {/* Holat */}
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                            style={{ background:`${usc.color}18`, color:usc.color, border:`1px solid ${usc.color}30` }}>
                            {usc.emoji} {usc.label}
                          </span>

                          {/* Sana */}
                          <p className="text-xs" style={{ color:"rgba(100,130,200,0.5)" }}>
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("uz-UZ") : "—"}
                          </p>

                          {/* Rasm */}
                          <div>
                            {u.imageUrl ? (
                              <button onClick={() => setModalImg(`${API_BASE}${u.imageUrl}`)}
                                className="block relative overflow-hidden rounded-xl transition-all"
                                style={{ border:"1px solid rgba(255,255,255,0.1)", width:72, height:52 }}
                                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(96,165,250,0.5)"}
                                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor="rgba(255,255,255,0.1)"}>
                                <img src={`${API_BASE}${u.imageUrl}`} alt="rasm"
                                  className="w-full h-full object-cover" />
                              </button>
                            ) : (
                              <span className="text-xs" style={{ color:"rgba(100,130,200,0.3)" }}>—</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-center" style={{ color:"rgba(100,130,200,0.35)" }}>
        Jami {filteredGroups.length} ta loyiha · {updates.length} ta yangilik
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
          </div>
        </div>
      )}
    </div>
  );
}
