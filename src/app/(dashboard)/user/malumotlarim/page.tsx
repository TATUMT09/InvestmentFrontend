"use client";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getMyUpdates } from "@/services/projectUpdateService";
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

export default function MalumotlarimPage() {
  const [updates,    setUpdates]    = useState<ProjectUpdate[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [tab,        setTab]        = useState("barchasi");
  const [search,     setSearch]     = useState("");
  const [modalImg,   setModalImg]   = useState<string | null>(null);

  useEffect(() => {
    getMyUpdates()
      .then(setUpdates)
      .catch(() => setUpdates([]))
      .finally(() => setLoading(false));
  }, []);

  const TABS = [
    { key: "barchasi", label: "Barchasi" },
    ...Object.entries(STATUS_CFG).map(([k, v]) => ({ key: k, label: v.label })),
  ];

  const counts: Record<string, number> = { barchasi: updates.length };
  updates.forEach(u => { counts[u.status] = (counts[u.status] || 0) + 1; });

  const filtered = useMemo(() => updates.filter(u => {
    const matchTab = tab === "barchasi" || u.status === tab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      u.title.toLowerCase().includes(q) ||
      (u.description ?? "").toLowerCase().includes(q) ||
      (u.projectName  ?? "").toLowerCase().includes(q);
    return matchTab && matchSearch;
  }), [updates, tab, search]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color:"rgba(220,235,255,0.95)" }}>
            Ma&apos;lumotlarim
          </h1>
          <p className="text-sm mt-1" style={{ color:"rgba(120,150,200,0.55)" }}>
            Yuborgan loyiha yangiliklari tarixi
          </p>
        </div>
        <Link href="/user/malumot-yuborish"
          className="flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
          style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}
          onMouseEnter={(e:any) => e.currentTarget.style.background="rgba(59,130,246,0.25)"}
          onMouseLeave={(e:any) => e.currentTarget.style.background="rgba(59,130,246,0.15)"}>
          <span>+</span> Yangi ma&apos;lumot
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label:"Jami",            val: updates.length,                       color:"#60a5fa" },
          { label:"Rejalashtirilgan",val: counts["REJALASHTIRILGAN"] || 0,      color:"#60a5fa" },
          { label:"Jarayonda",       val: counts["JARAYONDA"]        || 0,      color:"#f59e0b" },
          { label:"Kechikkan",       val: counts["KECHIKKAN"]        || 0,      color:"#f97316" },
          { label:"Tugallangan",     val: counts["TUGALLANGAN"]      || 0,      color:"#10b981" },
        ].map(s => (
          <div key={s.label} className="p-3 rounded-2xl text-center"
            style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xl font-bold" style={{ color: s.color }}>{loading ? "..." : s.val}</p>
            <p className="text-[10px] mt-0.5" style={{ color:"rgba(120,150,200,0.55)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            style={{ color:"rgba(100,130,200,0.4)" }}>
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Sarlavha yoki loyiha..."
            className="w-full text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none"
            style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", color:"rgba(200,220,255,0.85)" }}
            onFocus={e => { e.target.style.borderColor="rgba(59,130,246,0.35)"; }}
            onBlur={e  => { e.target.style.borderColor="rgba(255,255,255,0.08)"; }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[{ key:"barchasi", label:"Barchasi" }, { key:"JARAYONDA", label:"Jarayonda" }, { key:"TUGALLANGAN", label:"Tugallangan" }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="text-xs px-3 py-2 rounded-xl font-medium transition-all"
              style={{
                background: tab===t.key ? "rgba(59,130,246,0.18)" : "rgba(255,255,255,0.04)",
                border:`1px solid ${tab===t.key ? "rgba(59,130,246,0.38)" : "rgba(255,255,255,0.07)"}`,
                color: tab===t.key ? "#60a5fa" : "rgba(130,160,210,0.65)",
              }}>
              {t.label} {(counts[t.key]||0) > 0 && `(${counts[t.key]})`}
            </button>
          ))}
        </div>
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
          <p className="font-semibold mb-1" style={{ color:"rgba(150,180,230,0.7)" }}>Ma&apos;lumotlar topilmadi</p>
          <p className="text-sm mb-4" style={{ color:"rgba(100,130,200,0.45)" }}>
            {search ? "Qidiruvni o'zgartiring" : "Hali ma'lumot yubormagansiz"}
          </p>
          <Link href="/user/malumot-yuborish"
            className="inline-block text-sm font-bold px-5 py-2.5 rounded-xl"
            style={{ background:"rgba(59,130,246,0.15)", border:"1px solid rgba(59,130,246,0.3)", color:"#60a5fa" }}>
            Ma&apos;lumot yuborish →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((u, i) => {
            const sc = scfg(u.status);
            return (
              <div key={u.id} className="rounded-2xl p-4 transition-all"
                style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", animationDelay:`${i*40}ms` }}>
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background:`${sc.color}18`, border:`1.5px solid ${sc.color}35` }}>
                    {sc.emoji}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold mb-1" style={{ color:"rgba(200,220,255,0.9)" }}>{u.title}</p>
                    {u.description && (
                      <p className="text-xs mb-1.5 line-clamp-2" style={{ color:"rgba(140,170,220,0.6)" }}>{u.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color:"rgba(100,130,200,0.55)" }}>
                      {u.projectName && <span>🏗️ {u.projectName}</span>}
                      {u.createdAt   && <span>🕐 {new Date(u.createdAt).toLocaleDateString("uz-UZ")}</span>}
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background:`${sc.color}18`, color:sc.color, border:`1px solid ${sc.color}30` }}>
                      {sc.label}
                    </span>
                    {u.imageUrl && (
                      <button onClick={() => setModalImg(`${API_BASE}${u.imageUrl}`)}
                        className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all"
                        style={{ background:"rgba(96,165,250,0.12)", color:"#60a5fa", border:"1px solid rgba(96,165,250,0.25)" }}
                        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background="rgba(96,165,250,0.22)"}
                        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background="rgba(96,165,250,0.12)"}>
                        📷 Ko&apos;rish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

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
            <img src={modalImg} alt="preview"
              className="w-full rounded-2xl object-contain"
              style={{ maxHeight:"80vh", border:"1px solid rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      )}
    </div>
  );
}
